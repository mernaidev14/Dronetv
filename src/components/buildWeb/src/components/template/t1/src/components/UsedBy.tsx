import { motion } from "framer-motion";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Edit2, Save, X, Upload, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import BusinessInsider from "../public/images/logos/BusinessInsider.png";
import Forbes from "../public/images/logos/Forbes.png";
import TechCrunch from "../public/images/logos/TechCrunch.png";
import TheNewYorkTimes from "../public/images/logos/TheNewYorkTimes.png";
import USAToday from "../public/images/logos/USAToday.png";

export default function EditableUsedBy() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const fileInputRefs = useRef({});

  // Default content structure
  const defaultCompanies = [
    { image: BusinessInsider, name: "Business Insider", id: 1 },
    { image: Forbes, name: "Forbes", id: 2 },
    { image: TechCrunch, name: "TechCrunch", id: 3 },
    { image: TheNewYorkTimes, name: "NY Times", id: 4 },
    { image: USAToday, name: "USA Today", id: 5 },
  ];

  const defaultContent = {
    title: "USED BY",
    companies: defaultCompanies,
  };

  const [content, setContent] = useState(defaultContent);
  const [tempContent, setTempContent] = useState(defaultContent);

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
  const fetchUsedByData = async () => {
    setIsLoading(true);
    try {
      // Replace this with your actual API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: 1,
            title: "USED BY",
            companies: [
              { image: BusinessInsider, name: "Business Insider", id: 1 },
              { image: Forbes, name: "Forbes", id: 2 },
              { image: TechCrunch, name: "TechCrunch", id: 3 },
              { image: TheNewYorkTimes, name: "NY Times", id: 4 },
              { image: USAToday, name: "USA Today", id: 5 },
            ],
          });
        }, 1200); // Simulate network delay
      });

      setContent(response);
      setTempContent(response);
      setDataLoaded(true);
    } catch (error) {
      console.error("Error fetching used-by data:", error);
      // Keep default content on error
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate API call to save data to database
  const saveUsedByData = async (updatedContent) => {
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
      console.error("Error saving used-by data:", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Fetch data when component becomes visible
  useEffect(() => {
    if (isVisible && !dataLoaded && !isLoading) {
      fetchUsedByData();
    }
  }, [isVisible, dataLoaded, isLoading]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempContent(content);
  };

  const handleSave = async () => {
    const success = await saveUsedByData(tempContent);
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

  // Stable update functions with useCallback
  const updateTempContent = useCallback((field, value) => {
    setTempContent((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateCompanyName = useCallback((companyId, newName) => {
    setTempContent((prev) => ({
      ...prev,
      companies: prev.companies.map((company) =>
        company.id === companyId ? { ...company, name: newName } : company
      ),
    }));
  }, []);

  const handleImageUpload = useCallback((companyId, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempContent((prev) => ({
          ...prev,
          companies: prev.companies.map((company) =>
            company.id === companyId
              ? { ...company, image: e.target.result }
              : company
          ),
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const addCompany = useCallback(() => {
    setTempContent((prev) => {
      const newId = Math.max(...prev.companies.map((c) => c.id)) + 1;
      return {
        ...prev,
        companies: [
          ...prev.companies,
          { id: newId, name: "New Company", image: BusinessInsider },
        ],
      };
    });
  }, []);

  const removeCompany = useCallback((companyId) => {
    setTempContent((prev) => ({
      ...prev,
      companies: prev.companies.filter((company) => company.id !== companyId),
    }));
  }, []);

  // Memoized EditableText component to prevent recreation
  const EditableText = useMemo(() => {
    return ({ value, field, companyId, className = "", placeholder = "" }) => {
      const handleChange = (e) => {
        if (field === "title") {
          updateTempContent("title", e.target.value);
        } else if (field === "companyName" && companyId) {
          updateCompanyName(companyId, e.target.value);
        }
      };

      return (
        <input
          type='text'
          value={value}
          onChange={handleChange}
          className={`w-full bg-white border-2 border-dashed border-blue-300 rounded p-2 focus:border-blue-500 focus:outline-none text-center ${className}`}
          placeholder={placeholder}
        />
      );
    };
  }, [updateTempContent, updateCompanyName]);

  const displayContent = isEditing ? tempContent : content;

  return (
    <section ref={sectionRef} className='py-16 bg-white relative'>
      {/* Loading Overlay */}
      {isLoading && (
        <div className='absolute inset-0 bg-white/80 flex items-center justify-center z-30'>
          <div className='bg-white rounded-lg p-6 shadow-lg flex items-center gap-3 border'>
            <Loader2 className='w-5 h-5 animate-spin text-blue-600' />
            <span className='text-gray-700'>Loading content...</span>
          </div>
        </div>
      )}

      {/* Edit Controls - Always visible when data is loaded */}
      {dataLoaded && (
        <div className='absolute top-4 right-4 z-20'>
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              variant='outline'
              size='sm'
              className='bg-white hover:bg-gray-50 shadow-lg border-2 border-gray-200 hover:border-blue-300'
            >
              <Edit2 className='w-4 h-4 mr-2' />
              Edit
            </Button>
          ) : (
            <div className='flex gap-2'>
              <Button
                onClick={handleSave}
                size='sm'
                className='bg-green-600 hover:bg-green-700 text-white shadow-lg'
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
                className='bg-white hover:bg-gray-50 shadow-lg border-2'
                disabled={isSaving}
              >
                <X className='w-4 h-4 mr-2' />
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}

      <div className='max-w-7xl mx-auto px-4'>
        {/* Title Section */}
        {isEditing ? (
          <div className='mb-8'>
            <label className='block text-sm font-medium text-gray-700 mb-2 text-center'>
              Section Title
            </label>
            <div className='max-w-xs mx-auto'>
              <EditableText
                value={displayContent.title}
                field='title'
                className='text-gray-400 text-lg font-medium'
                placeholder='Section title'
              />
            </div>
          </div>
        ) : (
          <p className='text-center text-gray-400 text-lg mb-8'>
            {displayContent.title}
          </p>
        )}

        {/* Companies Section */}
        {isEditing ? (
          <div className='space-y-6'>
            <div className='text-center'>
              <Button
                onClick={addCompany}
                variant='outline'
                size='sm'
                className='bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700'
              >
                <Plus className='w-4 h-4 mr-2' />
                Add Company
              </Button>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6'>
              {displayContent.companies.map((company) => (
                <div
                  key={company.id}
                  className='bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300'
                >
                  <div className='space-y-3'>
                    {/* Company Image */}
                    <div className='text-center'>
                      <img
                        src={company.image}
                        alt={company.name}
                        className='h-12 mx-auto opacity-60 grayscale'
                      />
                      <Button
                        onClick={() =>
                          fileInputRefs.current[company.id]?.click()
                        }
                        variant='outline'
                        size='sm'
                        className='mt-2 text-xs'
                      >
                        <Upload className='w-3 h-3 mr-1' />
                        Change
                      </Button>
                      <input
                        ref={(el) => (fileInputRefs.current[company.id] = el)}
                        type='file'
                        accept='image/*'
                        onChange={(e) => handleImageUpload(company.id, e)}
                        className='hidden'
                      />
                    </div>

                    {/* Company Name */}
                    <div>
                      <label className='block text-xs font-medium text-gray-600 mb-1'>
                        Company Name
                      </label>
                      <EditableText
                        value={company.name}
                        field='companyName'
                        companyId={company.id}
                        className='text-sm'
                        placeholder='Company name'
                      />
                    </div>

                    {/* Remove Button */}
                    {displayContent.companies.length > 1 && (
                      <Button
                        onClick={() => removeCompany(company.id)}
                        variant='outline'
                        size='sm'
                        className='w-full bg-red-50 hover:bg-red-100 border-red-300 text-red-700'
                      >
                        <Trash2 className='w-3 h-3 mr-1' />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className='flex flex-wrap justify-around items-center gap-8'>
            {displayContent.companies.map((company, i) => (
              <motion.div
                key={company.id || i}
                className='flex-shrink-0'
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src={company.image}
                  alt={company.name}
                  className='h-8 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300'
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Editing Instructions */}
      {isEditing && (
        <div className='max-w-7xl mx-auto px-4 mt-8'>
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
            <p className='text-sm text-blue-700 text-center'>
              <strong>Edit Mode:</strong> Modify the section title, add/remove
              companies, change company names, and upload new logos. Click Save
              to keep your changes.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
