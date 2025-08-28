import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Edit2, Save, X, Upload, Loader2, Plus, Trash2 } from "lucide-react";
import Service1 from "../public/images/ServicesImg/Service1.jpg";
import Service2 from "../public/images/ServicesImg/Service3.jpg";

export default function EditableServices() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const sectionRef = useRef(null);
  const fileInputRefs = useRef({});

  // Default content structure
  const defaultServices = [
    {
      id: 1,
      image: Service1,
      title: "Digital Innovation",
      description: "Transform your business with cutting-edge solutions.",
      category: "Innovation",
    },
    {
      id: 2,
      image: Service2,
      title: "Strategic Consulting",
      description: "Expert guidance to unlock new opportunities.",
      category: "Consulting",
    },
    {
      id: 3,
      image: Service1,
      title: "Technology Solutions",
      description: "Custom tech implementations to enhance productivity.",
      category: "Technology",
    },
    {
      id: 4,
      image: Service2,
      title: "Business Strategy",
      description: "Comprehensive planning for growth and positioning.",
      category: "Strategy",
    },
    {
      id: 5,
      image: Service1,
      title: "Extra Service 1",
      description: "Additional service.",
      category: "Extra",
    },
    {
      id: 6,
      image: Service2,
      title: "Extra Service 2",
      description: "Another extra service.",
      category: "Extra",
    },
  ];

  const defaultCategories = [
    "All",
    "Consulting",
    "Technology",
    "Innovation",
    "Strategy",
    "Extra",
  ];

  const defaultContent = {
    sectionTitle: "Services",
    sectionDescription:
      "We provide comprehensive services to help your business thrive.",
    loadMoreButtonText: "Load More",
    services: defaultServices,
    categories: defaultCategories,
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
  const fetchServicesData = async () => {
    setIsLoading(true);
    try {
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: 1,
            sectionTitle: "Services",
            sectionDescription:
              "We provide comprehensive services to help your business thrive.",
            loadMoreButtonText: "Load More",
            services: defaultServices,
            categories: defaultCategories,
          });
        }, 1300);
      });

      setContent(response);
      setTempContent(response);
      setDataLoaded(true);
    } catch (error) {
      console.error("Error fetching services data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate API call to save data to database
  const saveServicesData = async (updatedContent) => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 1000);
      });

      return true;
    } catch (error) {
      console.error("Error saving services data:", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Fetch data when component becomes visible
  useEffect(() => {
    if (isVisible && !dataLoaded && !isLoading) {
      fetchServicesData();
    }
  }, [isVisible, dataLoaded, isLoading]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempContent(content);
  };

  const handleSave = async () => {
    const success = await saveServicesData(tempContent);
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

  const handleImageUpload = (serviceId, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempContent((prev) => ({
          ...prev,
          services: prev.services.map((service) =>
            service.id === serviceId
              ? { ...service, image: e.target.result }
              : service
          ),
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addService = () => {
    const newId = Math.max(...tempContent.services.map((s) => s.id)) + 1;
    setTempContent((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        {
          id: newId,
          title: "New Service",
          description: "Service description",
          category: "Innovation",
          image: Service1,
        },
      ],
    }));
  };

  const removeService = (serviceId) => {
    setTempContent((prev) => ({
      ...prev,
      services: prev.services.filter((service) => service.id !== serviceId),
    }));
  };

  // ✅ Stable update function so onChange doesn't change identity each render
  const updateService = useCallback((serviceId, field, value) => {
    setTempContent((prev) => ({
      ...prev,
      services: prev.services.map((service) =>
        service.id === serviceId ? { ...service, [field]: value } : service
      ),
    }));
  }, []);

  const addCategory = () => {
    const newCategory = prompt("Enter new category name:");
    if (newCategory && !tempContent.categories.includes(newCategory)) {
      setTempContent((prev) => ({
        ...prev,
        categories: [...prev.categories, newCategory],
      }));
    }
  };

  const removeCategory = (categoryToRemove) => {
    if (categoryToRemove === "All") return; // Cannot remove "All"
    setTempContent((prev) => ({
      ...prev,
      categories: prev.categories.filter((cat) => cat !== categoryToRemove),
      services: prev.services.map((service) =>
        service.category === categoryToRemove
          ? { ...service, category: "Innovation" }
          : service
      ),
    }));
  };

  // ✅ Memoized EditableText so inputs don't remount (keeps cursor/focus)
  const EditableText = useMemo(() => {
    return ({
      value,
      onChange,
      multiline = false,
      className = "",
      placeholder = "",
    }) => {
      const baseClasses =
        "w-full bg-white border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none";

      if (multiline) {
        return (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
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
          onChange={(e) => onChange(e.target.value)}
          className={`${baseClasses} p-2 ${className}`}
          placeholder={placeholder}
        />
      );
    };
  }, []);

  const displayContent = isEditing ? tempContent : content;

  const filteredServices =
    selectedCategory === "All"
      ? displayContent.services
      : displayContent.services.filter((s) => s.category === selectedCategory);

  // Show first 4 services initially
  const displayedServices = showAll
    ? filteredServices
    : filteredServices.slice(0, 4);

  return (
    <section
      ref={sectionRef}
      id='services'
      className='py-20 bg-white scroll-mt-20 relative'
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className='absolute inset-0 bg-white/80 flex items-center justify-center z-30'>
          <div className='bg-white rounded-lg p-6 shadow-lg flex items-center gap-3 border'>
            <Loader2 className='w-5 h-5 animate-spin text-blue-600' />
            <span className='text-gray-700'>Loading content...</span>
          </div>
        </div>
      )}

      {/* Edit Controls - Highly visible */}
      {dataLoaded && (
        <div className='absolute top-4 right-4 z-20'>
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              variant='outline'
              size='sm'
              className='bg-white hover:bg-gray-50 shadow-xl border-2 border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-600'
            >
              <Edit2 className='w-4 h-4 mr-2' />
              Edit Services
            </Button>
          ) : (
            <div className='flex gap-2'>
              <Button
                onClick={handleSave}
                size='sm'
                className='bg-green-600 hover:bg-green-700 text-white shadow-xl'
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
                className='bg-white hover:bg-gray-50 shadow-xl border-2'
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
        <div className='text-center mb-16'>
          {/* Section Title and Description */}
          {isEditing ? (
            <div className='space-y-4 max-w-2xl mx-auto'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Section Title
                </label>
                <EditableText
                  value={displayContent.sectionTitle}
                  onChange={(value) =>
                    setTempContent((prev) => ({ ...prev, sectionTitle: value }))
                  }
                  className='text-3xl font-bold text-gray-900 text-center'
                  placeholder='Section title'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Section Description
                </label>
                <EditableText
                  value={displayContent.sectionDescription}
                  onChange={(value) =>
                    setTempContent((prev) => ({
                      ...prev,
                      sectionDescription: value,
                    }))
                  }
                  multiline={true}
                  className='text-gray-600 text-center'
                  placeholder='Section description'
                />
              </div>
            </div>
          ) : (
            <>
              <h2 className='text-3xl font-bold text-gray-900 mb-4'>
                {displayContent.sectionTitle}
              </h2>
              <p className='text-gray-600 max-w-2xl mx-auto'>
                {displayContent.sectionDescription}
              </p>
            </>
          )}

          {/* Categories */}
          {isEditing ? (
            <div className='mt-6 space-y-4'>
              <div className='flex justify-center'>
                <Button
                  onClick={addCategory}
                  variant='outline'
                  size='sm'
                  className='bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700'
                >
                  <Plus className='w-4 h-4 mr-2' />
                  Add Category
                </Button>
              </div>
              <div className='flex flex-wrap justify-center gap-2'>
                {displayContent.categories.map((cat) => (
                  <div
                    key={cat}
                    className='flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1'
                  >
                    <span className='text-sm'>{cat}</span>
                    {cat !== "All" && (
                      <button
                        onClick={() => removeCategory(cat)}
                        className='text-red-500 hover:text-red-700 ml-1'
                      >
                        <X className='w-3 h-3' />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className='flex flex-wrap justify-center gap-4 mt-6'>
              {displayContent.categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setShowAll(false);
                  }}
                  className={`px-6 py-2 rounded-full transition-all duration-200 ${
                    selectedCategory === cat
                      ? "bg-[#ffeb3b] text-gray-900"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Services Grid */}
        {isEditing ? (
          <div className='space-y-6'>
            <div className='text-center'>
              <Button
                onClick={addService}
                variant='outline'
                size='sm'
                className='bg-green-50 hover:bg-green-100 border-green-300 text-green-700'
              >
                <Plus className='w-4 h-4 mr-2' />
                Add Service
              </Button>
            </div>

            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {displayContent.services.map((service) => (
                <Card
                  key={service.id}
                  className='shadow-lg border-2 border-dashed border-gray-300'
                >
                  <div className='relative'>
                    <img
                      src={service.image}
                      alt={service.title}
                      className='w-full h-48 object-cover'
                    />
                    <div className='absolute top-2 right-2'>
                      <Button
                        onClick={() =>
                          fileInputRefs.current[service.id]?.click()
                        }
                        variant='outline'
                        size='sm'
                        className='bg-white/90 backdrop-blur-sm text-xs'
                      >
                        <Upload className='w-3 h-3 mr-1' />
                        Change
                      </Button>
                      <input
                        ref={(el) => (fileInputRefs.current[service.id] = el)}
                        type='file'
                        accept='image/*'
                        onChange={(e) => handleImageUpload(service.id, e)}
                        className='hidden'
                      />
                    </div>

                    {/* Category Select */}
                    <div className='absolute top-2 left-2'>
                      <select
                        value={service.category}
                        onChange={(e) =>
                          updateService(service.id, "category", e.target.value)
                        }
                        className='bg-[#ffeb3b] text-gray-900 text-xs px-2 py-1 rounded border-none focus:outline-none'
                      >
                        {displayContent.categories
                          .filter((cat) => cat !== "All")
                          .map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <CardContent className='p-4 space-y-3'>
                    <div>
                      <label className='block text-xs font-medium text-gray-600 mb-1'>
                        Service Title
                      </label>
                      <EditableText
                        value={service.title}
                        onChange={(value) =>
                          updateService(service.id, "title", value)
                        }
                        className='text-xl font-semibold'
                        placeholder='Service title'
                      />
                    </div>

                    <div>
                      <label className='block text-xs font-medium text-gray-600 mb-1'>
                        Service Description
                      </label>
                      <EditableText
                        value={service.description}
                        onChange={(value) =>
                          updateService(service.id, "description", value)
                        }
                        multiline={true}
                        className='text-gray-600'
                        placeholder='Service description'
                      />
                    </div>

                    {/* Remove Service Button */}
                    {displayContent.services.length > 1 && (
                      <Button
                        onClick={() => removeService(service.id)}
                        variant='outline'
                        size='sm'
                        className='w-full bg-red-50 hover:bg-red-100 border-red-300 text-red-700'
                      >
                        <Trash2 className='w-3 h-3 mr-1' />
                        Remove Service
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More Button Text */}
            <div className='text-center'>
              <div className='max-w-xs mx-auto'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Load More Button Text
                </label>
                <EditableText
                  value={displayContent.loadMoreButtonText}
                  onChange={(value) =>
                    setTempContent((prev) => ({
                      ...prev,
                      loadMoreButtonText: value,
                    }))
                  }
                  placeholder='Load more button text'
                />
              </div>
            </div>
          </div>
        ) : (
          <div className='grid md:grid-cols-4 gap-8'>
            {displayedServices.map((service) => (
              <Card
                key={service.id}
                className='shadow-lg hover:shadow-2xl transition-all duration-300'
              >
                <div className='relative'>
                  <img
                    src={service.image}
                    alt={service.title}
                    className='w-full h-48 object-cover'
                  />
                  <Badge className='absolute top-4 left-4 bg-[#ffeb3b] text-gray-900'>
                    {service.category}
                  </Badge>
                </div>
                <CardContent className='p-6'>
                  <h3 className='text-xl font-semibold mb-2'>
                    {service.title}
                  </h3>
                  <p className='text-gray-600 mb-4'>{service.description}</p>
                  <Button
                    variant='ghost'
                    className='text-red-500 hover:text-red-600'
                  >
                    Learn More →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!isEditing && !showAll && filteredServices.length > 4 && (
          <div className='text-center mt-8'>
            <Button
              onClick={() => setShowAll(true)}
              className='px-6 py-2 bg-[#ffeb3b] hover:bg-yellow-300 text-gray-900'
            >
              {displayContent.loadMoreButtonText}
            </Button>
          </div>
        )}
      </div>

      {/* Editing Instructions */}
      {isEditing && (
        <div className='max-w-7xl mx-auto px-6 mt-8'>
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
            <p className='text-sm text-blue-700 text-center'>
              <strong>Edit Mode:</strong> Modify section title/description,
              add/remove services and categories, change service details, and
              upload new images. Use category dropdowns to assign services to
              categories.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
