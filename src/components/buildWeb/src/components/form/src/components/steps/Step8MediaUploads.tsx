import React from 'react';
import axios from 'axios';
import { FormStep } from '../FormStep';
import { FormInput } from '../FormInput';
import { StepProps } from '../../types/form';
import { Upload, FileText, Image, Video } from 'lucide-react';

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
      });
    };
    reader.onerror = (error) => reject(error);
  });
};

const Step8MediaUploads: React.FC<StepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
  isValid,
}) => {
  const API_URL =
    "https://14exr8c8g0.execute-api.ap-south-1.amazonaws.com/prod/drafts";

  // ✅ API Submit Handler
  const handleSubmit = async () => {
    try {
      // Separate files from other form data to avoid DynamoDB size limits
      const fileFields = [
        'companyLogoUrl', 'brochurePdfUrl', 'cataloguePdfUrl', 
        'dgcaTypeCertificateUrl', 'rptoAuthorisationCertificateUrl',
        'caseStudiesUrl', 'brandGuidelinesUrl'
      ];

      // Extract file data
      const files: any = {};
      const formDataWithoutFiles = { ...formData };

      fileFields.forEach(fieldName => {
        if (formData?.[fieldName]?.dataBase64) {
          files[fieldName] = formData[fieldName];
          // Replace file object with just filename reference in form data
          formDataWithoutFiles[fieldName] = {
            fileName: formData[fieldName].fileName,
            contentType: formData[fieldName].contentType,
            uploaded: false // Will be set to true after S3 upload
          };
        }
      });

      const payload = {
        userId: "TEMP_USER_ID234", // replace with real user ID from auth context
        templateSelection: formData?.templateSelection || null,
        templateDetails: {
          id: formData?.selectedTemplate?.id || null,
          name: formData?.selectedTemplate?.name || "",
          value: formData?.selectedTemplate?.value || "",
        },
        formData: formDataWithoutFiles, // Form data without large file objects
        files: files // Separate files object for S3 upload
      };

      // Calculate sizes
      const formDataSize = JSON.stringify(formDataWithoutFiles).length;
      const filesSize = JSON.stringify(files).length;
      const totalSize = JSON.stringify(payload).length;

      console.log("📊 Payload breakdown:", {
        formDataSize: Math.round(formDataSize / 1024) + "KB",
        filesSize: Math.round(filesSize / 1024) + "KB", 
        totalSize: Math.round(totalSize / 1024) + "KB",
        fileCount: Object.keys(files).length
      });

      // Check if still too large
      if (totalSize > 5 * 1024 * 1024) { // 5MB limit
        alert("Files are still too large. Please reduce file sizes.");
        return;
      }

      console.log("🚀 Sending optimized payload:", {
        userId: payload.userId,
        templateSelection: payload.templateSelection,
        templateDetails: payload.templateDetails,
        fileCount: Object.keys(files).length,
        filesToUpload: Object.keys(files).map(key => files[key]?.fileName).join(', '),
        payloadSize: Math.round(totalSize / 1024) + "KB"
      });

      const response = await axios.post(API_URL, payload, {
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        timeout: 60000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      console.log("✅ Draft saved:", response.data);
      alert("Draft saved successfully!");
      onNext();
    } catch (error: any) {
      console.error("❌ Error sending data to Lambda:", error);
      
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        
        if (error.response.data?.error?.includes('DynamoDB')) {
          alert(`Database Error: ${error.response.data.error}\n\nThe files are too large for direct storage. Please reduce file sizes or contact support.`);
        } else {
          alert(`Server error (${error.response.status}): ${error.response.data?.message || error.response.data?.error || 'Unknown error'}`);
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("No response from server. Please check your internet connection.");
      } else {
        console.error("Request setup error:", error.message);
        alert(`Request error: ${error.message}`);
      }
    }
  };

  const FileUploadSection = ({ 
    title, 
    icon: Icon, 
    children, 
    bgColor = 'bg-slate-50' 
  }: { 
    title: string; 
    icon: any; 
    children: React.ReactNode; 
    bgColor?: string;
  }) => (
    <div className={`${bgColor} rounded-lg p-6`}>
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
        <Icon className="w-6 h-6 mr-3 text-slate-600" />
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
  }: {
    label: string;
    accept: string;
    value: any;
    onChange: (value: any) => void;
    required?: boolean;
    description?: string;
  }) => (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {description && (
        <p className="text-sm text-slate-600 mb-2">{description}</p>
      )}
      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-slate-600 mb-2">
          {value?.fileName
            ? `File selected (${value.fileName})`
            : "Click to upload or drag and drop"}
        </p>
        <p className="text-xs text-slate-500 mb-3">{accept}</p>
        <input
          type="file"
          accept={accept}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              if (file.size > 20 * 1024 * 1024) {
                alert("File size must be less than 20MB");
                return;
              }
              try {
                const uploadObj = await fileToUploadObject(file);
                onChange(uploadObj);
              } catch (err) {
                console.error("Error converting file:", err);
              }
            }
          }}
          className="hidden"
          id={`upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
        />
        <label
          htmlFor={`upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
        >
          Choose File
        </label>
      </div>
    </div>
  );

  return (
    <FormStep
      title="Media Uploads"
      description="Upload your company logo, certificates, and other media assets."
      onNext={handleSubmit}
      onPrev={onPrev}
      isValid={isValid}
      currentStep={7}
      totalSteps={6}
    >
      <div className="space-y-8">
        {/* Template Selection Summary */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            📋 Selected Template
          </h3>
          <div className="text-yellow-700">
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
              <p className="text-red-600">
                ⚠️ No template selected. Please go back and select a template.
              </p>
            )}
          </div>
        </div>

        {/* Brand & Site Images */}
        <FileUploadSection title="Brand & Site Images" icon={Image} bgColor="bg-blue-50">
          <div className="space-y-6">
            <FileUploadBox
              label="Company Logo"
              accept=".png,.svg,.jpg,.jpeg"
              value={formData?.companyLogoUrl}
              onChange={(val) => updateFormData({ companyLogoUrl: val })}
              required
              description="PNG/SVG preferred, minimum 1000×1000px, max 5MB"
            />
          </div>
          <p className="text-sm text-blue-700 mt-4">
            <strong>Note:</strong> AI will generate additional images and design elements for your website automatically.
          </p>
        </FileUploadSection>

        {/* Documents & Certificates */}
        <FileUploadSection title="Documents & Certificates" icon={FileText} bgColor="bg-green-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileUploadBox
              label="DGCA Type Certificate"
              accept=".pdf,.jpg,.jpeg,.png"
              value={formData?.dgcaTypeCertificateUrl}
              onChange={(val) => updateFormData({ dgcaTypeCertificateUrl: val })}
              description="DGCA certification document, max 20MB"
            />
            
            <FileUploadBox
              label="RPTO Authorisation Certificate"
              accept=".pdf,.jpg,.jpeg,.png"
              value={formData?.rptoAuthorisationCertificateUrl}
              onChange={(val) => updateFormData({ rptoAuthorisationCertificateUrl: val })}
              description="RPTO certification document, max 20MB"
            />
            
            <FileUploadBox
              label="Company Brochure"
              accept=".pdf"
              value={formData?.brochurePdfUrl}
              onChange={(val) => updateFormData({ brochurePdfUrl: val })}
              description="Company brochure PDF, max 20MB"
            />
            
            <FileUploadBox
              label="Product Catalogue"
              accept=".pdf"
              value={formData?.cataloguePdfUrl}
              onChange={(val) => updateFormData({ cataloguePdfUrl: val })}
              description="Product catalogue PDF, max 20MB"
            />
            
            <FileUploadBox
              label="Case Studies"
              accept=".pdf,.doc,.docx"
              value={formData?.caseStudiesUrl}
              onChange={(val) => updateFormData({ caseStudiesUrl: val })}
              description="Case studies document, max 20MB"
            />
            
            <FileUploadBox
              label="Brand Guidelines"
              accept=".pdf"
              value={formData?.brandGuidelinesUrl}
              onChange={(val) => updateFormData({ brandGuidelinesUrl: val })}
              description="Brand guidelines PDF, max 20MB"
            />
          </div>
        </FileUploadSection>

        {/* Videos & Links */}
        <FileUploadSection title="Videos & Promotional Content" icon={Video} bgColor="bg-purple-50">
          <div className="space-y-4">
            <FormInput
              label="Promotional Video (5 minutes)"
              type="url"
              value={formData?.promoVideoFiveMinUrl || ''}
              onChange={(value) => updateFormData({ promoVideoFiveMinUrl: value })}
              placeholder="https://youtube.com/watch?v=..."
            />
            
            <FormInput
              label="Promotional Video (1 minute)"
              type="url"
              value={formData?.promoVideoOneMinUrl || ''}
              onChange={(value) => updateFormData({ promoVideoOneMinUrl: value })}
              placeholder="https://youtube.com/watch?v=..."
            />
            
            <FormInput
              label="Company Profile Link"
              type="url"
              value={formData?.companyProfileLink || ''}
              onChange={(value) => updateFormData({ companyProfileLink: value })}
              placeholder="https://drive.google.com/..."
            />
          </div>
          
          <div className="mt-6 p-4 bg-purple-100 rounded-lg">
            <h4 className="font-semibold text-purple-900 mb-2">Video Guidelines:</h4>
            <ul className="text-purple-800 text-sm space-y-1">
              <li>• Videos should be 1080p or higher resolution</li>
              <li>• YouTube, Vimeo, or Google Drive links are preferred</li>
              <li>• Ensure videos are publicly accessible or properly shared</li>
              <li>• 5-minute video: Comprehensive company overview</li>
              <li>• 1-minute video: Quick highlights for social media</li>
            </ul>
          </div>
        </FileUploadSection>

        {/* Debug Section - Remove in production */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">🔍 Debug Info</h3>
          <div className="space-x-2">
            <button
              type="button"
              onClick={() => {
                console.log("🔍 Full Form Data:", formData);
                const size = Math.round(JSON.stringify(formData).length / 1024);
                console.log("🔍 Current payload size:", size, "KB");
                alert(`Check console. Current size: ${size}KB (DynamoDB limit: 400KB)`);
              }}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              Log Form Data
            </button>
            <button
              type="button"
              onClick={() => {
                const fileFields = ['companyLogoUrl', 'brochurePdfUrl', 'cataloguePdfUrl', 'dgcaTypeCertificateUrl', 'rptoAuthorisationCertificateUrl', 'caseStudiesUrl', 'brandGuidelinesUrl'];
                const files = fileFields.filter(field => formData?.[field]?.dataBase64).map(field => ({
                  field,
                  fileName: formData[field].fileName,
                  size: Math.round(formData[field].dataBase64.length / 1024) + 'KB'
                }));
                console.log("📁 Uploaded files:", files);
                alert(`Files: ${files.length} uploaded. Check console for details.`);
              }}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Check Files
            </button>
          </div>
          <p className="text-red-600 text-sm mt-2">
            ⚠️ DynamoDB limit: 400KB per item. Current approach separates large files for S3 upload.
          </p>
        </div>

        {/* Upload Summary */}
        <div className="bg-slate-100 rounded-lg p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Upload Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-slate-800 mb-2">Required Files:</h4>
              <ul className="space-y-1 text-sm">
                <li className={`flex items-center ${formData?.companyLogoUrl ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="w-2 h-2 rounded-full mr-2 bg-current"></span>
                  Company Logo {formData?.companyLogoUrl ? '✓' : '(Required)'}
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-800 mb-2">File Limits:</h4>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>• Images: Maximum 5MB each</li>
                <li>• PDFs: Maximum 20MB each</li>
                <li>• All URLs must use HTTPS</li>
                <li>• Supported formats: JPG, PNG, SVG, PDF</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">🎉 Ready to Generate Your Website!</h4>
            <p className="text-green-700 text-sm">
              Once you click "Submit Form", our AI will create a professional website with all your information, 
              generate additional content, optimize for SEO, and create a beautiful design that matches your industry.
            </p>
          </div>
        </div>
      </div>
    </FormStep>
  );
};

export default Step8MediaUploads;