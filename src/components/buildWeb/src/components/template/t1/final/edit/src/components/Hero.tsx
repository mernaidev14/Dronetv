import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Edit2, Save, X, Loader2, Upload } from "lucide-react";
import { toast } from "react-toastify";

import Hero1 from "../public/images/Hero/Hero1.jpg";
import Hero3 from "../public/images/Hero/Hero3.jpg";
import Cust1 from "../public/images/customers/customer-1.jpg";
import Cust2 from "../public/images/customers/customer-3.jpg";
import Cust3 from "../public/images/customers/customer-4.jpg";
import Cust4 from "../public/images/customers/customer-5.jpg";
import Cust5 from "../public/images/customers/customer-6.jpg";
import Cust6 from "../public/images/customers/ben.jpg";
import HeroBackground from "../public/images/Hero/HeroBackground.jpg";

// Customer images
const customerImages = [Cust1, Cust2, Cust3, Cust4, Cust5, Cust6];

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

const imageVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function EditableHero({ heroData, onStateChange, userId, publishedId, templateSelection }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef(null);

  // Pending image files for S3 upload
  const [pendingImageFiles, setPendingImageFiles] = useState({
    hero1Image: null,
    hero3Image: null,
    customerImages: Array(6).fill(null)
  });

  // Default content with images
  const defaultContent = heroData;

  // Consolidated state
  const [heroState, setHeroState] = useState(defaultContent);
  const [tempHeroState, setTempHeroState] = useState(defaultContent);

  // Add this useEffect to notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(heroState);
    }
  }, [heroState, onStateChange]);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
    };
  }, []);

  // Fake API fetch
  const fetchHeroData = async () => {
    setIsLoading(true);
    try {
      const response = await new Promise((resolve) =>
        setTimeout(() => resolve(defaultContent), 1200)
      );
      setHeroState(response);
      setTempHeroState(response);
      setDataLoaded(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible && !dataLoaded && !isLoading) {
      fetchHeroData();
    }
  }, [isVisible, dataLoaded, isLoading]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempHeroState(heroState);
  };

  // Fixed Save function with proper S3 URL handling
  const handleSave = async () => {
    try {
      setIsUploading(true);
      
      // Create a copy of tempHeroState to update with S3 URLs
      let updatedState = { ...tempHeroState };

      // Upload hero1Image if there's a pending file
      if (pendingImageFiles.hero1Image) {
        if (!userId || !publishedId || !templateSelection) {
          toast.error('Missing user information. Please refresh and try again.');
          return;
        }

        const formData = new FormData();
        formData.append('file', pendingImageFiles.hero1Image);
        formData.append('sectionName', 'hero');
        formData.append('imageField', 'hero1Image');
        formData.append('templateSelection', templateSelection);

        const uploadResponse = await fetch(`https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`, {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          updatedState.hero1Image = uploadData.imageUrl;
          console.log('Hero1 image uploaded to S3:', uploadData.imageUrl);
        } else {
          const errorData = await uploadResponse.json();
          toast.error(`Hero1 image upload failed: ${errorData.message || 'Unknown error'}`);
          return;
        }
      }

      // Upload hero3Image if there's a pending file
      if (pendingImageFiles.hero3Image) {
        const formData = new FormData();
        formData.append('file', pendingImageFiles.hero3Image);
        formData.append('sectionName', 'hero');
        formData.append('imageField', 'hero3Image');
        formData.append('templateSelection', templateSelection);

        const uploadResponse = await fetch(`https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`, {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          updatedState.hero3Image = uploadData.imageUrl;
          console.log('Hero3 image uploaded to S3:', uploadData.imageUrl);
        } else {
          const errorData = await uploadResponse.json();
          toast.error(`Hero3 image upload failed: ${errorData.message || 'Unknown error'}`);
          return;
        }
      }

      // Upload customer images if there are pending files
      for (let i = 0; i < pendingImageFiles.customerImages.length; i++) {
        if (pendingImageFiles.customerImages[i]) {
          const formData = new FormData();
          formData.append('file', pendingImageFiles.customerImages[i]);
          formData.append('sectionName', 'hero');
          formData.append('imageField', `customerImage${i}`);
          formData.append('templateSelection', templateSelection);

          const uploadResponse = await fetch(`https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`, {
            method: 'POST',
            body: formData,
          });

          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json();
            updatedState.customerImages[i] = uploadData.imageUrl;
            console.log(`Customer image ${i} uploaded to S3:`, uploadData.imageUrl);
          } else {
            const errorData = await uploadResponse.json();
            toast.error(`Customer image ${i} upload failed: ${errorData.message || 'Unknown error'}`);
            return;
          }
        }
      }

      // Clear pending files
      setPendingImageFiles({
        hero1Image: null,
        hero3Image: null,
        customerImages: Array(6).fill(null)
      });

      // Save the updated state with S3 URLs
      setIsSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate save API call
      
      // Update both states with the new URLs
      setHeroState(updatedState);
      setTempHeroState(updatedState);
      
      setIsEditing(false);
      toast.success('Hero section saved with S3 URLs ready for publish');

    } catch (error) {
      console.error('Error saving hero section:', error);
      toast.error('Error saving changes. Please try again.');
    } finally {
      setIsUploading(false);
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempHeroState(heroState);
    setPendingImageFiles({
      hero1Image: null,
      hero3Image: null,
      customerImages: Array(6).fill(null)
    });
    setIsEditing(false);
  };

  // Image upload handlers with validation
  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
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
    setPendingImageFiles(prev => ({ ...prev, [field]: file }));

    // Show immediate local preview
    const reader = new FileReader();
    reader.onload = () => {
      setTempHeroState(prev => ({ 
        ...prev, 
        [field]: reader.result 
      }));
    };
    reader.readAsDataURL(file);
  };

  // Customer image upload handler with validation
  const handleCustomerImageUpload = (e, index) => {
    const file = e.target.files[0];
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
    setPendingImageFiles(prev => {
      const updatedCustomerFiles = [...prev.customerImages];
      updatedCustomerFiles[index] = file;
      return { ...prev, customerImages: updatedCustomerFiles };
    });

    // Show immediate local preview
    const reader = new FileReader();
    reader.onload = () => {
      const updatedCustomerImages = [...tempHeroState.customerImages];
      updatedCustomerImages[index] = reader.result;
      setTempHeroState(prev => ({ 
        ...prev, 
        customerImages: updatedCustomerImages 
      }));
    };
    reader.readAsDataURL(file);
  };

  // Stable update functions with useCallback
  const updateTempContent = useCallback((field, value) => {
    setTempHeroState((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Memoized EditableText
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
        "w-full bg-white/10 backdrop-blur-sm border-2 border-dashed border-yellow-300 rounded focus:border-yellow-400 focus:outline-none text-white placeholder-gray-300";

      if (multiline) {
        return (
          <textarea
            value={value}
            onChange={handleChange}
            className={`${baseClasses} p-3 resize-none ${className}`}
            placeholder={placeholder}
            rows={4}
          />
        );
      }

      return (
        <input
          type='text'
          value={value}
          onChange={handleChange}
          className={`${baseClasses} p-2 ${className}`}
          placeholder={placeholder}
        />
      );
    };
  }, [updateTempContent]);

  return (
    <section
      id='home'
      ref={heroRef}
      className='relative h-100vh flex items-center py-52 sm:px-6 lg:px-8 lg:pb-32'
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${HeroBackground}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "scroll",
      }}
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className='absolute inset-0 bg-black/60 flex items-center justify-center z-30'>
          <div className='bg-white rounded-lg p-6 shadow-lg flex items-center gap-3'>
            <Loader2 className='w-5 h-5 animate-spin text-blue-600' />
            <span className='text-gray-700'>Loading content...</span>
          </div>
        </div>
      )}

      {/* Edit controls */}
      <div className='absolute top-40 right-4 z-50'>
        {!isEditing ? (
          <Button
            onClick={handleEdit}
            variant='outline'
            size='sm'
            className='bg-white/90 backdrop-blur-sm hover:bg-white shadow-md'
            disabled={isLoading}
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
              className='bg-white/90 backdrop-blur-sm hover:bg-white shadow-md'
              disabled={isSaving || isUploading}
            >
              <X className='w-4 h-4 mr-2' />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Hero content */}
      <div className='relative z-10 max-w-7xl mx-auto w-full '>
        <div className='grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center'>
          {/* Text section */}
          <motion.div
            className='space-y-8 text-center lg:text-left order-2 lg:order-1'
            initial='hidden'
            animate='visible'
            variants={itemVariants}
          >
            {!isEditing ? (
              <motion.h1
                className='text-3xl sm:text-4xl md:text-5xl xl:text-3xl font-bold text-white leading-tight px-2 sm:px-0'
                variants={itemVariants}
              >
                {heroState.heading}
                <span className='block text-yellow-400 mt-2'>
                  {heroState.subheading}
                </span>
              </motion.h1>
            ) : (
              <div className='space-y-4'>
                <EditableText
                  value={tempHeroState.heading}
                  field='heading'
                  className='text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold leading-tight'
                  placeholder='Main heading'
                />
                <EditableText
                  value={tempHeroState.subheading}
                  field='subheading'
                  className='text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold text-yellow-400'
                  placeholder='Sub heading'
                />
              </div>
            )}

            {!isEditing ? (
              <motion.p
                className='text-base sm:text-md lg:text-md text-gray-200 max-w-2xl mx-auto lg:mx-0 px-2 sm:px-0 leading-relaxed'
                variants={itemVariants}
              >
                {heroState.description}
              </motion.p>
            ) : (
              <EditableText
                value={tempHeroState.description}
                field='description'
                multiline
                className='text-base sm:text-lg lg:text-xl text-gray-200 leading-relaxed'
                placeholder='Hero description'
              />
            )}

            {/* Buttons */}
            {!isEditing ? (
              <motion.div
                className='flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start px-2 sm:px-0'
                variants={itemVariants}
              >
                <a
                  href={heroState.primaryButtonLink}
                  className='bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-full px-8 py-4 font-semibold transition-all duration-300 transform hover:scale-105 inline-block text-center'
                >
                  {heroState.primaryBtn}
                </a>
                <a
                  href={heroState.secondaryButtonLink}
                  className='text-white border border-white hover:bg-white hover:text-gray-900 rounded-full px-8 py-4 font-semibold transition-all duration-300 inline-block text-center'
                >
                  {heroState.secondaryBtn}
                </a>
              </motion.div>
            ) : (
              <div className='space-y-4'>
                <EditableText
                  value={tempHeroState.primaryBtn}
                  field='primaryBtn'
                  placeholder='Primary button text'
                />
                <EditableText
                  value={tempHeroState.secondaryBtn}
                  field='secondaryBtn'
                  placeholder='Secondary button text'
                />
                <EditableText
                  value={tempHeroState.primaryButtonLink}
                  field='primaryButtonLink'
                  placeholder='Primary button link'
                />
                <EditableText
                  value={tempHeroState.secondaryButtonLink}
                  field='secondaryButtonLink'
                  placeholder='Secondary button link'
                />
              </div>
            )}

            {/* Customers */}
            <motion.div
              className='flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6 pt-8 px-2 sm:px-0'
              variants={itemVariants}
            >
              <div className='flex -space-x-2'>
                {tempHeroState.customerImages.map((img, i) => (
                  <motion.div
                    key={i}
                    className='w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white shadow-lg bg-cover bg-center relative'
                    style={{ backgroundImage: `url('${img}')` }}
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {isEditing && (
                      <label className='absolute inset-0 bg-black/70 opacity-0 hover:opacity-100 flex items-center justify-center rounded-full cursor-pointer transition-opacity'>
                        <Upload className='w-4 h-4 text-white' />
                        <input
                          type='file'
                          accept='image/*'
                          className='hidden'
                          onChange={(e) => handleCustomerImageUpload(e, i)}
                        />
                      </label>
                    )}
                    {isEditing && pendingImageFiles.customerImages[i] && (
                      <div className='absolute -bottom-6 left-0 text-xs text-orange-300 bg-black/70 px-1 rounded'>
                        Pending
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
              {!isEditing ? (
                <span className='text-sm sm:text-base text-white font-normal'>
                  {heroState.trustText}
                </span>
              ) : (
                <EditableText
                  value={tempHeroState.trustText}
                  field='trustText'
                  placeholder='Trust text'
                  className='text-sm sm:text-base text-white'
                />
              )}
            </motion.div>
          </motion.div>

          {/* Images */}
          <motion.div
            className='relative order-1 lg:order-2 flex justify-center lg:justify-end px-4 sm:px-0'
            initial='hidden'
            animate='visible'
            variants={itemVariants}
          >
            <div className='relative w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl'>
              <motion.div className='relative' variants={imageVariants}>
                <div className='relative'>
                  <img
                    src={isEditing ? tempHeroState.hero1Image : heroState.hero1Image}
                    alt='Innovation showcase'
                    className='w-full h-64 sm:h-80 lg:h-96 object-cover rounded-3xl shadow-2xl'
                  />
                  {isEditing && (
                    <label className='absolute bottom-2 right-2 bg-black/70 text-white p-2 rounded cursor-pointer hover:bg-black/90 transition-colors'>
                      <Upload className='w-4 h-4' />
                      <input
                        type='file'
                        accept='image/*'
                        className='hidden'
                        onChange={(e) => handleImageUpload(e, 'hero1Image')}
                      />
                    </label>
                  )}
                  {isEditing && pendingImageFiles.hero1Image && (
                    <div className='absolute top-2 left-2 text-xs text-orange-300 bg-black/70 px-2 py-1 rounded'>
                      Pending upload: {pendingImageFiles.hero1Image.name}
                    </div>
                  )}
                </div>
                <motion.div
                  className='absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 lg:-bottom-8 lg:-left-8'
                  variants={imageVariants}
                  transition={{ delay: 0.3 }}
                >
                  <div className='relative'>
                    <img
                      src={isEditing ? tempHeroState.hero3Image : heroState.hero3Image}
                      alt='Tech innovation'
                      className='w-48 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-2xl shadow-xl border-4 border-white'
                    />
                    {isEditing && (
                    <label className='absolute bottom-1 right-1 bg-black/70 text-white p-1 rounded cursor-pointer hover:bg-black/90 transition-colors'>
                      <Upload className='w-3 h-3' />
                      <input
                        type='file'
                        accept='image/*'
                        className='hidden'
                        onChange={(e) => handleImageUpload(e, 'hero3Image')}
                      />
                    </label>
                    )}
                    {isEditing && pendingImageFiles.hero3Image && (
                      <div className='absolute -top-6 left-0 text-xs text-orange-300 bg-black/70 px-1 rounded'>
                        Pending
                      </div>
                    )}
                  </div>
                </motion.div>
                <motion.div
                  className='absolute -top-6 -right-6 w-16 h-16 sm:w-20 sm:h-20 bg-yellow-400 rounded-full opacity-80'
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 