import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Edit2, Save, X, Loader2, Upload } from "lucide-react";

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

export default function EditableHero({ heroData }) {
  const [isEditing, setIsEditing] = useState(false);

  // Default content
  const defaultContent = {
    badgeText: "Trusted by 500+ Companies",
    heading: heroData?.heading || "Transform Your Business with",
    subheading: heroData?.subheading || "Innovation",
    description:
      heroData?.description ||
      "We help companies scale and grow with cutting-edge solutions, expert guidance, and proven strategies that deliver",
    highlightDesc: "exceptional results",
    primaryBtn: heroData?.primaryAction?.text || "Get Started Today",
    secondaryBtn: "Watch Demo",
    trustText: "Join 500+ satisfied clients",
    primaryButtonLink: "#contact",
    secondaryButtonLink: "#about",
  };

  // Consolidated state
  const [heroState, setHeroState] = useState(defaultContent);
  const [tempHeroState, setTempHeroState] = useState(defaultContent);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef(null);

  // Image states
  const [hero1Image, setHero1Image] = useState(Hero1);
  const [hero3Image, setHero3Image] = useState(Hero3);

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

  // Fake API save
  const saveHeroData = async (updatedContent) => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return true;
    } finally {
      setIsSaving(false);
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

  const handleSave = async () => {
    const success = await saveHeroData(tempHeroState);
    if (success) {
      setHeroState(tempHeroState);
      setIsEditing(false);
    } else {
      alert("Failed to save. Try again.");
    }
  };

  const handleCancel = () => {
    setTempHeroState(heroState);
    setHero1Image(Hero1);
    setHero3Image(Hero3);
    setIsEditing(false);
  };

  // Image upload handlers
  const handleImageUpload = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
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
        // height: 95,
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
      <div className='fixed top-40 right-4 z-50'>
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
              className='bg-white/90 backdrop-blur-sm hover:bg-white shadow-md'
              disabled={isSaving}
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
              </div>
            )}

            {/* Customers */}
            {!isEditing && (
              <motion.div
                className='flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6 pt-8 px-2 sm:px-0'
                variants={itemVariants}
              >
                <div className='flex -space-x-2'>
                  {customerImages.map((img, i) => (
                    <motion.div
                      key={i}
                      className='w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white shadow-lg bg-cover bg-center'
                      style={{ backgroundImage: `url('${img}')` }}
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                  ))}
                </div>
                <span className='text-sm sm:text-base text-white font-normal'>
                  {heroState.trustText}
                </span>
              </motion.div>
            )}
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
                    src={hero1Image}
                    alt='Innovation showcase'
                    className='w-full h-64 sm:h-80 lg:h-96 object-cover rounded-3xl shadow-2xl'
                  />
                  {isEditing && (
                    <label className='absolute bottom-2 right-2 bg-black/70 text-white p-2 rounded cursor-pointer'>
                      <Upload className='w-4 h-4' />
                      <input
                        type='file'
                        accept='image/*'
                        className='hidden'
                        onChange={(e) => handleImageUpload(e, setHero1Image)}
                      />
                    </label>
                  )}
                </div>
                <motion.div
                  className='absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 lg:-bottom-8 lg:-left-8'
                  variants={imageVariants}
                  transition={{ delay: 0.3 }}
                >
                  <div className='relative'>
                    <img
                      src={hero3Image}
                      alt='Tech innovation'
                      className='w-48 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-2xl shadow-xl border-4 border-white'
                    />
                    {isEditing && (
                      <label className='absolute bottom-1 right-1 bg-black/70 text-white p-1 rounded cursor-pointer'>
                        <Upload className='w-3 h-3' />
                        <input
                          type='file'
                          accept='image/*'
                          className='hidden'
                          onChange={(e) => handleImageUpload(e, setHero3Image)}
                        />
                      </label>
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
