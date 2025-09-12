import { motion } from "motion/react";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Edit2, Save, X, Upload, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import img from "../public/images/About/About.jpg";

// Custom Button component
const Button = ({
  children,
  onClick,
  variant,
  size,
  className,
  disabled,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
    default: "bg-blue-600 text-white hover:bg-blue-700",
  };
  const sizes = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant] || variants.default} ${
        sizes[size] || sizes.default
      } ${className || ""}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// Custom Badge component
const Badge = ({ children, className }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
  >
    {children}
  </span>
);

export default function EditableAbout({ aboutData, onStateChange, userId, publishedId, templateSelection }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);  
  const [isUploading, setIsUploading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Pending image file for S3 upload
  const [pendingImageFile, setPendingImageFile] = useState(null);

  // Default content structure based on the provided JSON
  const defaultContent = aboutData;;

  // Consolidated state
  const [aboutState, setAboutState] = useState(defaultContent);
  const [tempAboutState, setTempAboutState] = useState(defaultContent);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(aboutState);
    }
  }, [aboutState, onStateChange]);

  // Intersection Observer for visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Simulate API call to fetch data from database
  const fetchAboutData = async () => {
    setIsLoading(true);
    try {
      // Replace this with your actual API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(defaultContent);
        }, 1500); // Simulate network delay
      });

      setAboutState(response);
      setTempAboutState(response);
      setDataLoaded(true);
    } catch (error) {
      console.error("Error fetching about data:", error);
      // Keep default content on error
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when component becomes visible
  useEffect(() => {
    if (isVisible && !dataLoaded && !isLoading) {
      fetchAboutData();
    }
  }, [isVisible, dataLoaded, isLoading]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempAboutState(aboutState);
    setPendingImageFile(null);
  };

  // Updated Save function with S3 upload
  const handleSave = async () => {
    try {
      setIsUploading(true);
      
      // Create a copy of tempAboutState to update with S3 URLs
      let updatedState = { ...tempAboutState };

      // Upload office image if there's a pending file
      if (pendingImageFile) {
        if (!userId || !publishedId || !templateSelection) {
          toast.error('Missing user information. Please refresh and try again.');
          return;
        }

        const formData = new FormData();
        formData.append('file', pendingImageFile);
        formData.append('sectionName', 'about');
        formData.append('imageField', 'officeImage');
        formData.append('templateSelection', templateSelection);

        const uploadResponse = await fetch(`https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`, {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          updatedState.officeImage = uploadData.imageUrl;
          console.log('Office image uploaded to S3:', uploadData.imageUrl);
        } else {
          const errorData = await uploadResponse.json();
          toast.error(`Image upload failed: ${errorData.message || 'Unknown error'}`);
          return;
        }
      }

      // Clear pending file
      setPendingImageFile(null);

      // Save the updated state with S3 URLs
      setIsSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate save API call
      
      // Update both states with the new URLs
      setAboutState(updatedState);
      setTempAboutState(updatedState);
      
      setIsEditing(false);
      toast.success('About section saved with S3 URLs ready for publish');

    } catch (error) {
      console.error('Error saving about section:', error);
      toast.error('Error saving changes. Please try again.');
    } finally {
      setIsUploading(false);
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempAboutState(aboutState);
    setPendingImageFile(null);
    setIsEditing(false);
  };

  // Stable update function with useCallback
  const updateTempContent = useCallback((field, value) => {
    setTempAboutState((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Update functions for arrays
  const updateCertification = useCallback((index, value) => {
    setTempAboutState((prev) => {
      const updatedCertifications = [...prev.certifications];
      updatedCertifications[index] = value;
      return { ...prev, certifications: updatedCertifications };
    });
  }, []);

  const updateAchievement = useCallback((index, value) => {
    setTempAboutState((prev) => {
      const updatedAchievements = [...prev.achievements];
      updatedAchievements[index] = value;
      return { ...prev, achievements: updatedAchievements };
    });
  }, []);

  // Add new items to arrays
  const addCertification = useCallback(() => {
    setTempAboutState((prev) => ({
      ...prev,
      certifications: [...prev.certifications, "New Certification"],
    }));
  }, []);

  const addAchievement = useCallback(() => {
    setTempAboutState((prev) => ({
      ...prev,
      achievements: [...prev.achievements, "New Achievement"],
    }));
  }, []);

  // Remove items from arrays
  const removeCertification = useCallback((index) => {
    setTempAboutState((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  }, []);

  const removeAchievement = useCallback((index) => {
    setTempAboutState((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
  }, []);

  // Image upload handler with validation
  const handleImageUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File size must be less than 5MB');
      return;
    }

    // Store the file for upload on Save
    setPendingImageFile(file);

    // Show immediate local preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setTempAboutState((prev) => ({
        ...prev,
        officeImage: e.target.result,
      }));
    };
    reader.readAsDataURL(file);
  }, []);

  // Memoized EditableText component to prevent recreation
  const EditableText = useMemo(() => {
    return ({
      value,
      field,
      multiline = false,
      className = "",
      placeholder = "",
      onChange = null, // Allow custom onChange handler
    }) => {
      const handleChange = (e) => {
        if (onChange) {
          onChange(e); // Use custom handler if provided
        } else {
          updateTempContent(field, e.target.value); // Use default handler
        }
      };

      const baseClasses =
        "w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none";

      if (multiline) {
        return (
          <textarea
            value={value}
            onChange={handleChange}
            className={`${baseClasses} p-2 resize-none ${className}`}
            placeholder={placeholder}
            rows={3}
          />
        );
      }

      return (
        <input
          type='text'
          value={value}
          onChange={handleChange}
          className={`${baseClasses} p-1 ${className}`}
          placeholder={placeholder}
        />
      );
    };
  }, [updateTempContent]);

  const displayContent = isEditing ? tempAboutState : aboutState;

  return (
    <section
      id='about'
      ref={sectionRef}
      className='py-20 bg-blue-50 scroll-mt-20 relative'
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className='absolute inset-0 bg-blue-50/80 flex items-center justify-center z-20'>
          <div className='bg-white rounded-lg p-6 shadow-lg flex items-center gap-3'>
            <Loader2 className='w-5 h-5 animate-spin text-blue-600' />
            <span className='text-gray-700'>Loading content...</span>
          </div>
        </div>
      )}

      {/* Edit Controls - Only show after data is loaded */}
      {dataLoaded && (
        <div className='absolute top-4 right-4 z-10'>
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              variant='outline'
              size='sm'
              className='bg-white hover:bg-gray-50 shadow-md'
            >
              <Edit2 className='w-4 h-4 mr-2' />
              Edit
            </Button>
          ) : (
            <div className='flex gap-2'>
              <Button
                onClick={handleSave}
                size='sm'
                className='bg-green-600 hover:bg-green-700 text-white shadow-md'
                disabled={isSaving || isUploading}
              >
                {isUploading ? (
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                ) : isSaving ? (
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                ) : (
                  <Save className='w-4 h-4 mr-2' />
                )}
                {isUploading ? "Uploading..." : isSaving ? "Saving..." : "Save"}
              </Button>
              <Button
                onClick={handleCancel}
                variant='outline'
                size='sm'
                className='bg-white hover:bg-gray-50 shadow-md'
                disabled={isSaving || isUploading}
              >
                <X className='w-4 h-4 mr-2' />
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}

      <div className='max-w-7xl mx-auto px-6'>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <Badge className='bg-yellow-400 text-gray-900 mb-4'>
              About Company
            </Badge>

            <h2 className='text-3xl font-bold text-gray-900 mb-6'>
              About {displayContent.companyName}
            </h2>

            <div className='space-y-4 text-gray-700'>
              <div className='grid grid-cols-1 gap-4 text-sm'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <strong>Company:</strong>{" "}
                    {isEditing ? (
                      <EditableText
                        value={displayContent.companyName}
                        field='companyName'
                        placeholder='Company name'
                      />
                    ) : (
                      displayContent.companyName
                    )}
                  </div>
                  <div>
                    <strong>Industry:</strong>{" "}
                    {isEditing ? (
                      <EditableText
                        value={displayContent.industry}
                        field='industry'
                        placeholder='Industry'
                      />
                    ) : (
                      displayContent.industry
                    )}
                  </div>
                  <div>
                    <strong>Established:</strong>{" "}
                    {isEditing ? (
                      <EditableText
                        value={displayContent.established}
                        field='established'
                        placeholder='Year established'
                      />
                    ) : (
                      displayContent.established
                    )}
                  </div>
                  <div>
                    <strong>Headquarters:</strong>{" "}
                    {isEditing ? (
                      <EditableText
                        value={displayContent.headquarters}
                        field='headquarters'
                        placeholder='Headquarters location'
                      />
                    ) : (
                      displayContent.headquarters
                    )}
                  </div>
                </div>
              </div>

              {isEditing ? (
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Description
                  </label>
                  <EditableText
                    value={displayContent.description1}
                    field='description1'
                    multiline={true}
                    className='text-gray-600 leading-relaxed'
                    placeholder='Company description part 1'
                  />
                  <EditableText
                    value={displayContent.description2}
                    field='description2'
                    multiline={true}
                    className='text-gray-600 leading-relaxed mt-2'
                    placeholder='Company description part 2'
                  />
                </div>
              ) : (
                <>
                  <p className='text-gray-600 leading-relaxed'>
                    {displayContent.description1}
                  </p>
                  <p className='text-gray-600 leading-relaxed'>
                    {displayContent.description2}
                  </p>
                </>
              )}

              <div className='space-y-2'>
                <div>
                  <strong>Mission:</strong>{" "}
                  {isEditing ? (
                    <div>
                      <EditableText
                        value={displayContent.mission}
                        field='mission'
                        multiline={true}
                        placeholder='Mission statement'
                      />
                    </div>
                  ) : (
                    displayContent.mission
                  )}
                </div>
                <div>
                  <strong>Vision:</strong>{" "}
                  {isEditing ? (
                    <div>
                      <EditableText
                        value={displayContent.vision}
                        field='vision'
                        multiline={true}
                        placeholder='Vision statement'
                      />
                    </div>
                  ) : (
                    displayContent.vision
                  )}
                </div>
              </div>

              {/* Certifications - FIXED */}
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Certifications</h3>
                {isEditing ? (
                  <div className="space-y-2">
                    {displayContent.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={cert}
                          onChange={(e) => updateCertification(index, e.target.value)}
                          className="w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1"
                          placeholder="Certification"
                        />
                        <Button
                          onClick={() => removeCertification(index)}
                          size="sm"
                          variant="outline"
                          className="bg-red-50 hover:bg-red-100 text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={addCertification}
                      size="sm"
                      variant="outline"
                      className="bg-green-50 hover:bg-green-100 text-green-700"
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add Certification
                    </Button>
                  </div>
                ) : (
                  <ul className="list-disc list-inside space-y-1">
                    {displayContent.certifications.map((cert, index) => (
                      <li key={index}>{cert}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Achievements - FIXED */}
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Achievements</h3>
                {isEditing ? (
                  <div className="space-y-2">
                    {displayContent.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={achievement}
                          onChange={(e) => updateAchievement(index, e.target.value)}
                          className="w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1"
                          placeholder="Achievement"
                        />
                        <Button
                          onClick={() => removeAchievement(index)}
                          size="sm"
                          variant="outline"
                          className="bg-red-50 hover:bg-red-100 text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={addAchievement}
                      size="sm"
                      variant="outline"
                      className="bg-green-50 hover:bg-green-100 text-green-700"
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add Achievement
                    </Button>
                  </div>
                ) : (
                  <ul className="list-disc list-inside space-y-1">
                    {displayContent.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='relative'
          >
            {isEditing && (
              <div className='absolute top-2 right-2 z-10'>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  size='sm'
                  variant='outline'
                  className='bg-white/90 backdrop-blur-sm shadow-md'
                >
                  <Upload className='w-4 h-4 mr-2' />
                  Change Image
                </Button>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  onChange={handleImageUpload}
                  className='hidden'
                />
                {pendingImageFile && (
                  <p className='text-xs text-orange-600 mt-1 bg-white p-1 rounded'>
                    Image selected: {pendingImageFile.name}
                  </p>
                )}
              </div>
            )}
            <img
              src={displayContent.officeImage || "https://via.placeholder.com/500x300?text=Office+Image"}
              alt='Office'
              className='rounded-2xl shadow-2xl w-full h-full object-cover'
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}