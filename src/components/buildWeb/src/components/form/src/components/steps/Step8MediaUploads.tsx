import React, { useState } from "react";
import axios from "axios";
import { FormStep } from "../FormStep";
import { FormInput } from "../FormInput";
import { StepProps } from "../../types/form";
import {
  Upload,
  FileText,
  Image,
  Video,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useTemplate,useUserAuth } from "../../../../../../../context/context";
import { toast } from "react-toastify";

// ✅ Convert file to base64 + metadata
const fileToUploadObject = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve({
        fileName: file.name,
        contentType: file.type,
        dataBase64: reader.result as string, // keeps MIME prefix
        fileSize: file.size,
      });
    };
    reader.onerror = (error) => reject(error);
  });
};

// Utility function to chunk array
const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// Retry mechanism with exponential backoff
const retryRequest = async (
  url: string,
  payload: any,
  retries = 3,
  timeout = 120000
): Promise<any> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });
      return response;
    } catch (error: any) {
      console.warn(`Attempt ${i + 1}/${retries} failed:`, error.message);

      if (i === retries - 1) {
        throw error; // Final attempt failed
      }

      // Exponential backoff: wait 1s, 2s, 4s...
      const waitTime = Math.pow(2, i) * 1000;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }
};

const Step8MediaUploads: React.FC<StepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
  isValid,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [fileProcessingStatus, setFileProcessingStatus] = useState<{
    [key: string]: "pending" | "processing" | "completed" | "error";
  }>({});
  const { setDraftDetails } = useTemplate();
  const {user} = useUserAuth()
  
  const API_URL =
    "https://14exr8c8g0.execute-api.ap-south-1.amazonaws.com/prod/drafts";

  // ✅ Enhanced API Submit Handler with batching and retry
  const handleSubmit = async () => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus("Preparing files...");

    try {
      // Separate files from other form data
      const fileFields = [
        "companyLogoUrl",
        "brochurePdfUrl",
        "cataloguePdfUrl",
        "dgcaTypeCertificateUrl",
        "rptoAuthorisationCertificateUrl",
        "caseStudiesUrl",
        "brandGuidelinesUrl",
      ];

      // Extract file data and prepare batches
      const files: any = {};
      const formDataWithoutFiles = { ...formData };
      let totalFiles = 0;

      // Identify files that need uploading
      fileFields.forEach((fieldName) => {
        if (formData?.[fieldName]?.dataBase64) {
          files[fieldName] = formData[fieldName];
          totalFiles++;
          setFileProcessingStatus((prev) => ({
            ...prev,
            [fieldName]: "pending",
          }));

          // Replace file object with reference in form data
          formDataWithoutFiles[fieldName] = {
            fileName: formData[fieldName].fileName,
            contentType: formData[fieldName].contentType,
            uploaded: false,
          };
        }
      });

      if (totalFiles === 0) {
        // No files to upload, just save form data
        const simplePayload = {
          userId: user.email,
          templateSelection: formData?.templateSelection || null,
          templateDetails: {
            id: formData?.selectedTemplate?.id || null,
            name: formData?.selectedTemplate?.name || "",
            value: formData?.selectedTemplate?.value || "",
          },
          formData: formDataWithoutFiles,
          files: {},
        };

        setUploadStatus("Saving form data...");
        const response = await retryRequest(API_URL, simplePayload, 3, 60000);

        console.log("✅ Draft saved (no files):", response.data);
        setDraftDetails(response.data);
        setUploadStatus("Form saved successfully!");
        setUploadProgress(100);

        setTimeout(() => {
          toast.success("Form submitted successfully!");
          onNext();
        }, 1000);
        return;
      }

      // Process files in smaller batches to avoid timeouts
      const fileEntries = Object.entries(files);
      const batchSize = Math.min(2, totalFiles); // Process max 2 files at once
      const batches = chunkArray(fileEntries, batchSize);

      console.log(
        `📦 Processing ${totalFiles} files in ${batches.length} batches`
      );

      let processedFiles = 0;
      let allUploadedFiles: any = {};

      // Process each batch
      for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const batch = batches[batchIndex];
        const batchFiles: any = {};

        // Prepare current batch
        batch.forEach(([fieldName, fileData]) => {
          batchFiles[fieldName] = fileData;
          setFileProcessingStatus((prev) => ({
            ...prev,
            [fieldName]: "processing",
          }));
        });

        const batchPayload = {
          userId: user.email,
          templateSelection:
            formData?.templateSelection ||
            formData?.selectedTemplate?.value ||
            "",
          templateDetails: {
            id: formData?.selectedTemplate?.id || null,
            name: formData?.selectedTemplate?.name || "",
            value: formData?.selectedTemplate?.value || "",
          },
          formData: formDataWithoutFiles,
          files: batchFiles,
          batchInfo: {
            currentBatch: batchIndex + 1,
            totalBatches: batches.length,
            isLastBatch: batchIndex === batches.length - 1,
          },
        };

        // Calculate payload size
        const payloadSize = JSON.stringify(batchPayload).length;
        console.log(
          `📊 Batch ${batchIndex + 1} payload size:`,
          Math.round(payloadSize / 1024) + "KB"
        );

        // Check size limit
        if (payloadSize > 6 * 1024 * 1024) {
          // 6MB limit with buffer
          throw new Error(
            `Batch ${batchIndex + 1} is too large (${Math.round(
              payloadSize / 1024
            )}KB). Please reduce file sizes.`
          );
        }

        setUploadStatus(
          `Uploading batch ${batchIndex + 1}/${batches.length}...`
        );

        try {
          // Upload current batch with retry
          const response = await retryRequest(API_URL, batchPayload, 3, 180000); // 3 minutes per batch

          console.log(`✅ Batch ${batchIndex + 1} uploaded:`, response.data);

          // Mark batch files as completed
          batch.forEach(([fieldName]) => {
            setFileProcessingStatus((prev) => ({
              ...prev,
              [fieldName]: "completed",
            }));
          });

          // Merge uploaded files
          if (response.data.uploadedFiles) {
            allUploadedFiles = {
              ...allUploadedFiles,
              ...response.data.uploadedFiles,
            };
          }

          processedFiles += batch.length;
          const progress = Math.round((processedFiles / totalFiles) * 90); // Leave 10% for final steps
          setUploadProgress(progress);
        } catch (error: any) {
          console.error(`❌ Batch ${batchIndex + 1} failed:`, error);

          // Mark batch files as error
          batch.forEach(([fieldName]) => {
            setFileProcessingStatus((prev) => ({
              ...prev,
              [fieldName]: "error",
            }));
          });

          throw new Error(
            `Batch ${batchIndex + 1} upload failed: ${error.message}`
          );
        }

        // Small delay between batches to avoid overwhelming the server
        if (batchIndex < batches.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      setUploadStatus("Finalizing submission...");
      setUploadProgress(95);

      // Final success steps
      setUploadProgress(100);
      setUploadStatus("All files uploaded successfully!");

      console.log("🎉 All batches completed successfully");

      setTimeout(() => {
        toast.success(
          "All files uploaded successfully! Your website generation has started."
        );
        onNext();
      }, 1500);
    } catch (error: any) {
      console.error("❌ Upload process failed:", error);

      setUploadStatus("Upload failed");
      setUploadProgress(0);

      let errorMessage = "Upload failed. ";

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        console.error("Response status:", status);
        console.error("Response data:", data);

        if (status === 413) {
          errorMessage +=
            "Files are too large. Please reduce file sizes and try again.";
        } else if (data?.error?.includes("DynamoDB")) {
          errorMessage += `Database Error: ${data.error}`;
        } else if (data?.error?.includes("timeout")) {
          errorMessage +=
            "Server timeout. Files may be too large. Please try with smaller files.";
        } else {
          errorMessage += `Server error (${status}): ${
            data?.message || data?.error || "Unknown error"
          }`;
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
        errorMessage +=
          "No response from server. Please check your internet connection and try again.";
      } else if (error.message?.includes("timeout")) {
        errorMessage +=
          "Upload timeout. Files may be too large. Please try with smaller files or better connection.";
      } else {
        errorMessage += error.message || "Unknown error occurred.";
      }

      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const FileUploadSection = ({
    title,
    icon: Icon,
    children,
    bgColor = "bg-slate-50",
  }: {
    title: string;
    icon: any;
    children: React.ReactNode;
    bgColor?: string;
  }) => (
    <div className={`${bgColor} rounded-lg p-6`}>
      <h3 className='text-lg font-bold text-slate-900 mb-4 flex items-center'>
        <Icon className='w-6 h-6 mr-3 text-slate-600' />
        {title}
      </h3>
      {children}
    </div>
  );

  const FileUploadBox = ({
    label,
    accept,
    value,
    onChange,
    required = false,
    description,
    fieldName,
  }: {
    label: string;
    accept: string;
    value: any;
    onChange: (value: any) => void;
    required?: boolean;
    description?: string;
    fieldName?: string;
  }) => {
    const status = fieldName ? fileProcessingStatus[fieldName] : undefined;

    const getStatusIcon = () => {
      switch (status) {
        case "processing":
          return <Loader2 className='w-4 h-4 animate-spin text-blue-500' />;
        case "completed":
          return <CheckCircle className='w-4 h-4 text-green-500' />;
        case "error":
          return <AlertCircle className='w-4 h-4 text-red-500' />;
        default:
          return null;
      }
    };

    const getStatusColor = () => {
      switch (status) {
        case "processing":
          return "border-blue-300 bg-blue-50";
        case "completed":
          return "border-green-300 bg-green-50";
        case "error":
          return "border-red-300 bg-red-50";
        default:
          return "border-slate-300";
      }
    };

    return (
      <div className='mb-4'>
        <label className='block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2'>
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
          {getStatusIcon()}
        </label>
        {description && (
          <p className='text-sm text-slate-600 mb-2'>{description}</p>
        )}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-slate-400 transition-colors ${getStatusColor()}`}
        >
          <Upload className='w-8 h-8 text-slate-400 mx-auto mb-2' />
          <p className='text-slate-600 mb-2'>
            {value?.fileName
              ? `File selected: ${value.fileName} (${Math.round(
                  (value.fileSize || 0) / 1024
                )}KB)`
              : "Click to upload or drag and drop"}
          </p>
          <p className='text-xs text-slate-500 mb-3'>{accept}</p>
          <input
            type='file'
            accept={accept}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                if (file.size > 20 * 1024 * 1024) {
                  toast.warn("File size must be less than 20MB");
                  return;
                }
                try {
                  const uploadObj = await fileToUploadObject(file);
                  onChange(uploadObj);

                  if (fieldName) {
                    setFileProcessingStatus((prev) => ({
                      ...prev,
                      [fieldName]: "pending",
                    }));
                  }
                } catch (err) {
                  console.error("Error converting file:", err);
                  toast.error("Error processing file. Please try again.");
                }
              }
            }}
            className='hidden'
            id={`upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
            disabled={isUploading}
          />
          <label
            htmlFor={`upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
            className={`inline-block px-4 py-2 rounded-lg cursor-pointer transition-colors ${
              isUploading
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isUploading ? "Uploading..." : "Choose File"}
          </label>
        </div>
      </div>
    );
  };

  return (
    <FormStep
      title='Media Uploads'
      description='Upload your company logo, certificates, and other media assets.'
      onNext={handleSubmit}
      onPrev={onPrev}
      isValid={isValid && !isUploading}
      currentStep={7}
      totalSteps={6}
      nextButtonText={isUploading ? "Uploading..." : "Submit Form"}
    >
      <div className='space-y-8'>
        {/* Upload Progress */}
        {isUploading && (
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
            <div className='flex items-center mb-2'>
              <Loader2 className='w-5 h-5 animate-spin text-blue-600 mr-2' />
              <h3 className='text-lg font-semibold text-blue-800'>
                Uploading Files...
              </h3>
            </div>
            <p className='text-blue-700 mb-3'>{uploadStatus}</p>
            <div className='w-full bg-blue-200 rounded-full h-3'>
              <div
                className='bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out'
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className='text-sm text-blue-600 mt-2'>
              {uploadProgress}% complete
            </p>
          </div>
        )}

        {/* Template Selection Summary */}
        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6'>
          <h3 className='text-lg font-semibold text-yellow-800 mb-2'>
            📋 Selected Template
          </h3>
          <div className='text-yellow-700'>
            {formData?.selectedTemplate?.name ? (
              <>
                <p>
                  <strong>Template:</strong> {formData.selectedTemplate.name}
                </p>
                <p>
                  <strong>Template ID:</strong>{" "}
                  {formData.selectedTemplate.value}
                </p>
              </>
            ) : (
              <p className='text-red-600'>
                ⚠️ No template selected. Please go back and select a template.
              </p>
            )}
          </div>
        </div>

        {/* Brand & Site Images */}
        <FileUploadSection
          title='Brand & Site Images'
          icon={Image}
          bgColor='bg-blue-50'
        >
          <div className='space-y-6'>
            <FileUploadBox
              label='Company Logo'
              accept='.png,.svg,.jpg,.jpeg'
              value={formData?.companyLogoUrl}
              onChange={(val) => updateFormData({ companyLogoUrl: val })}
              required
              description='PNG/SVG preferred, minimum 1000×1000px, max 5MB'
              fieldName='companyLogoUrl'
            />
          </div>
          <p className='text-sm text-blue-700 mt-4'>
            <strong>Note:</strong> AI will generate additional images and design
            elements for your website automatically.
          </p>
        </FileUploadSection>

        {/* Documents & Certificates */}
        <FileUploadSection
          title='Documents & Certificates'
          icon={FileText}
          bgColor='bg-green-50'
        >
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <FileUploadBox
              label='DGCA Type Certificate'
              accept='.pdf,.jpg,.jpeg,.png'
              value={formData?.dgcaTypeCertificateUrl}
              onChange={(val) =>
                updateFormData({ dgcaTypeCertificateUrl: val })
              }
              description='DGCA certification document, max 20MB'
              fieldName='dgcaTypeCertificateUrl'
            />

            <FileUploadBox
              label='RPTO Authorisation Certificate'
              accept='.pdf,.jpg,.jpeg,.png'
              value={formData?.rptoAuthorisationCertificateUrl}
              onChange={(val) =>
                updateFormData({ rptoAuthorisationCertificateUrl: val })
              }
              description='RPTO certification document, max 20MB'
              fieldName='rptoAuthorisationCertificateUrl'
            />

            <FileUploadBox
              label='Company Brochure'
              accept='.pdf'
              value={formData?.brochurePdfUrl}
              onChange={(val) => updateFormData({ brochurePdfUrl: val })}
              description='Company brochure PDF, max 20MB'
              fieldName='brochurePdfUrl'
            />

            <FileUploadBox
              label='Product Catalogue'
              accept='.pdf'
              value={formData?.cataloguePdfUrl}
              onChange={(val) => updateFormData({ cataloguePdfUrl: val })}
              description='Product catalogue PDF, max 20MB'
              fieldName='cataloguePdfUrl'
            />

            <FileUploadBox
              label='Case Studies'
              accept='.pdf,.doc,.docx'
              value={formData?.caseStudiesUrl}
              onChange={(val) => updateFormData({ caseStudiesUrl: val })}
              description='Case studies document, max 20MB'
              fieldName='caseStudiesUrl'
            />

            <FileUploadBox
              label='Brand Guidelines'
              accept='.pdf'
              value={formData?.brandGuidelinesUrl}
              onChange={(val) => updateFormData({ brandGuidelinesUrl: val })}
              description='Brand guidelines PDF, max 20MB'
              fieldName='brandGuidelinesUrl'
            />
          </div>
        </FileUploadSection>

        {/* Videos & Links */}
        <FileUploadSection
          title='Videos & Promotional Content'
          icon={Video}
          bgColor='bg-purple-50'
        >
          <div className='space-y-4'>
            <FormInput
              label='Promotional Video (5 minutes)'
              type='url'
              value={formData?.promoVideoFiveMinUrl || ""}
              onChange={(value) =>
                updateFormData({ promoVideoFiveMinUrl: value })
              }
              placeholder='https://youtube.com/watch?v=...'
              disabled={isUploading}
            />

            <FormInput
              label='Promotional Video (1 minute)'
              type='url'
              value={formData?.promoVideoOneMinUrl || ""}
              onChange={(value) =>
                updateFormData({ promoVideoOneMinUrl: value })
              }
              placeholder='https://youtube.com/watch?v=...'
              disabled={isUploading}
            />

            <FormInput
              label='Company Profile Link'
              type='url'
              value={formData?.companyProfileLink || ""}
              onChange={(value) =>
                updateFormData({ companyProfileLink: value })
              }
              placeholder='https://drive.google.com/...'
              disabled={isUploading}
            />
          </div>

          <div className='mt-6 p-4 bg-purple-100 rounded-lg'>
            <h4 className='font-semibold text-purple-900 mb-2'>
              Video Guidelines:
            </h4>
            <ul className='text-purple-800 text-sm space-y-1'>
              SuccessPage
              <li>• Videos should be 1080p or higher resolution</li>
              <li>• YouTube, Vimeo, or Google Drive links are preferred</li>
              <li>
                • Ensure videos are publicly accessible or properly shared
              </li>
              <li>• 5-minute video: Comprehensive company overview</li>
              <li>• 1-minute video: Quick highlights for social media</li>
            </ul>
          </div>
        </FileUploadSection>

        {/* Upload Summary */}
        <div className='bg-slate-100 rounded-lg p-6'>
          <h3 className='text-lg font-bold text-slate-900 mb-4'>
            Upload Summary
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <h4 className='font-semibold text-slate-800 mb-2'>
                Required Files:
              </h4>
              <ul className='space-y-1 text-sm'>
                <li
                  className={`flex items-center ${
                    formData?.companyLogoUrl ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <span className='w-2 h-2 rounded-full mr-2 bg-current'></span>
                  Company Logo {formData?.companyLogoUrl ? "✓" : "(Required)"}
                </li>
              </ul>
            </div>

            <div>
              <h4 className='font-semibold text-slate-800 mb-2'>
                File Limits:
              </h4>
              <ul className='space-y-1 text-sm text-slate-600'>
                <li>• Images: Maximum 5MB each</li>
                <li>• PDFs: Maximum 20MB each</li>
                <li>• All URLs must use HTTPS</li>
                <li>• Supported formats: JPG, PNG, SVG, PDF</li>
              </ul>
            </div>
          </div>

          <div className='mt-6 p-4 bg-green-50 rounded-lg border border-green-200'>
            <h4 className='font-semibold text-green-800 mb-2'>
              🎉 Ready to Generate Your Website!
            </h4>
            <p className='text-green-700 text-sm'>
              Once you click "Submit Form", our AI will create a professional
              website with all your information, generate additional content,
              optimize for SEO, and create a beautiful design that matches your
              industry. The process may take a few minutes for large files.
            </p>
          </div>
        </div>
      </div>
    </FormStep>
  );
};

export default Step8MediaUploads; //update step medis 8 code
