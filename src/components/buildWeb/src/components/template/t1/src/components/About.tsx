import { motion } from "framer-motion";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Edit2, Save, X, Upload, Loader2 } from "lucide-react";
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

export default function EditableAbout() {
  const useScrollAnimation = () => {
    const [ref, setRef] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      if (!ref) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting);
        },
        { threshold: 0.1 }
      );

      observer.observe(ref);
      return () => observer.unobserve(ref);
    }, [ref]);

    return [setRef, isVisible];
  };

  const [aboutRef, aboutVisible] = useScrollAnimation();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const fileInputRef = useRef(null);

  // Default/initial content structure
  const defaultContent = {
    badgeText: "About Company",
    title: "About Company",
    company: "Company Name",
    industry: "Industry",
    established: "Year",
    headquarters: "Location",
    description: "Company description will appear here...",
    mission: "Company mission statement...",
    vision: "Company vision statement...",
    buttonText: "Learn More",
    image: img,
  };

  const [content, setContent] = useState(defaultContent);
  const [tempContent, setTempContent] = useState(defaultContent);

  // Simulate API call to fetch data from database
  const fetchAboutData = async () => {
    setIsLoading(true);
    try {
      // Replace this with your actual API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: 1,
            badgeText: "About Company",
            title: "About Company",
            company: "Innovative Labs",
            industry: "Technology & Innovation",
            established: "2015",
            headquarters: "Silicon Valley",
            description:
              "Our company offers innovative solutions designed to meet your unique business needs. With a team of experts, we ensure quality, reliability, and on-time delivery in every project. From planning to execution, we provide end-to-end services that drive sustainable growth.",
            mission:
              "To create cutting-edge solutions that empower businesses through innovation and technology.",
            vision:
              "To be a global leader in driving innovation that shapes a smarter, sustainable future.",
            buttonText: "Learn More",
            image: img,
          });
        }, 1500); // Simulate network delay
      });

      setContent(response);
      setTempContent(response);
      setDataLoaded(true);
    } catch (error) {
      console.error("Error fetching about data:", error);
      // Keep default content on error
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate API call to save data to database
  const saveAboutData = async (updatedContent) => {
    setIsSaving(true);
    try {
      // Replace this with your actual API call
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 1000); // Simulate network delay
      });

      return true;
    } catch (error) {
      console.error("Error saving about data:", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Fetch data when component becomes visible
  useEffect(() => {
    if (aboutVisible && !dataLoaded && !isLoading) {
      fetchAboutData();
    }
  }, [aboutVisible, dataLoaded, isLoading]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempContent(content);
  };

  const handleSave = async () => {
    const success = await saveAboutData(tempContent);
    if (success) {
      setContent(tempContent);
      setIsEditing(false);
    } else {
      alert("Failed to save changes. Please try again.");
    }
  };

  const handleCancel = () => {
    setTempContent(content);
    setIsEditing(false);
  };

  // Stable update function with useCallback
  const updateTempContent = useCallback((field, value) => {
    setTempContent((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleImageUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempContent((prev) => ({
          ...prev,
          image: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Memoized EditableText component to prevent recreation
  const EditableText = useMemo(() => {
    return ({
      value,
      field,
      multiline = false,
      className = "",
      placeholder = "",
    }) => {
      const handleChange = (e) => {
        updateTempContent(field, e.target.value);
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

  const displayContent = isEditing ? tempContent : content;

  return (
    <section
      id='about'
      ref={aboutRef}
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
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                ) : (
                  <Save className='w-4 h-4 mr-2' />
                )}
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button
                onClick={handleCancel}
                variant='outline'
                size='sm'
                className='bg-white hover:bg-gray-50 shadow-md'
                disabled={isSaving}
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
            animate={aboutVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {isEditing ? (
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Badge Text
                </label>
                <EditableText
                  value={displayContent.badgeText}
                  field='badgeText'
                  className='text-sm font-medium'
                  placeholder='Badge text'
                />
              </div>
            ) : (
              <Badge className='bg-yellow-400 text-gray-900 mb-4'>
                {displayContent.badgeText}
              </Badge>
            )}

            {isEditing ? (
              <div className='mb-6'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Section Title
                </label>
                <EditableText
                  value={displayContent.title}
                  field='title'
                  className='text-3xl font-bold text-gray-900'
                  placeholder='Section title'
                />
              </div>
            ) : (
              <h2 className='text-3xl font-bold text-gray-900 mb-6'>
                {displayContent.title}
              </h2>
            )}

            <div className='space-y-4 text-gray-700'>
              <div className='grid grid-cols-1 gap-4 text-sm'>
                {isEditing && (
                  <label className='block text-sm font-medium text-gray-700 -mb-2'>
                    Company Details
                  </label>
                )}
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <strong>Company:</strong>{" "}
                    {isEditing ? (
                      <EditableText
                        value={displayContent.company}
                        field='company'
                        placeholder='Company name'
                      />
                    ) : (
                      displayContent.company
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
                    value={displayContent.description}
                    field='description'
                    multiline={true}
                    className='text-gray-600 leading-relaxed'
                    placeholder='Company description'
                  />
                </div>
              ) : (
                <p className='text-gray-600 leading-relaxed'>
                  {displayContent.description}
                </p>
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
            </div>

            {isEditing ? (
              <div className='mt-6'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Button Text
                </label>
                <EditableText
                  value={displayContent.buttonText}
                  field='buttonText'
                  placeholder='Button text'
                />
              </div>
            ) : (
              <Button className='bg-yellow-400 text-gray-900 hover:bg-yellow-300 rounded-full mt-6'>
                {displayContent.buttonText}
              </Button>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={aboutVisible ? { opacity: 1, x: 0 } : {}}
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
              </div>
            )}
            <img
              src={displayContent.image}
              alt='About Company'
              className='rounded-2xl shadow-2xl w-full'
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
