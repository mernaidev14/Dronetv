import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Edit2,
  Save,
  X,
  Upload,
  Loader2,
  Plus,
  Trash2,
  Clock,
  DollarSign,
  CheckCircle,
  Users,
  Star,
} from "lucide-react";

export default function EditableServices({ serviceData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const [expandedService, setExpandedService] = useState(null);
  const sectionRef = useRef(null);
  const fileInputRefs = useRef({});

  // Transform serviceData to internal format
  const transformServiceData = (data) => {
    if (!data || !data.services) return null;

    const categories = [
      "All",
      ...new Set(data.services.map((service) => service.category)),
    ];

    return {
      sectionTitle: data.heading?.head || "Our Services",
      sectionDescription:
        data.heading?.desc ||
        "Professional drone services for your business needs",
      services: data.services.map((service, index) => ({
        id: index + 1,
        title: service.title,
        description: service.description,
        detailedDescription: service.detailedDescription,
        category: service.category,
        image: service.image,
        pricing: service.pricing,
        timeline: service.timeline,
        features: service.features || [],
        benefits: service.benefits || [],
        process: service.process || [],
      })),
      categories,
    };
  };

  const [content, setContent] = useState(null);
  const [tempContent, setTempContent] = useState(null);

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

  // Initialize content when serviceData is available
  useEffect(() => {
    if (serviceData && !dataLoaded) {
      const transformedData = transformServiceData(serviceData);
      if (transformedData) {
        setContent(transformedData);
        setTempContent(transformedData);
        setDataLoaded(true);
      }
    }
  }, [serviceData, dataLoaded]);

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
          detailedDescription: "Detailed service description",
          category: prev.categories.find((cat) => cat !== "All") || "General",
          image:
            "https://images.unsplash.com/photo-1473968512647-3e447244af8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
          pricing: "₹10,000 - ₹50,000",
          timeline: "1-3 days",
          features: ["Feature 1", "Feature 2"],
          benefits: ["Benefit 1", "Benefit 2"],
          process: ["Step 1", "Step 2"],
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

  const updateService = useCallback((serviceId, field, value) => {
    setTempContent((prev) => ({
      ...prev,
      services: prev.services.map((service) =>
        service.id === serviceId ? { ...service, [field]: value } : service
      ),
    }));
  }, []);

  const updateServiceArray = useCallback((serviceId, field, index, value) => {
    setTempContent((prev) => ({
      ...prev,
      services: prev.services.map((service) =>
        service.id === serviceId
          ? {
              ...service,
              [field]: service[field].map((item, i) =>
                i === index ? value : item
              ),
            }
          : service
      ),
    }));
  }, []);

  const addToServiceArray = useCallback((serviceId, field) => {
    setTempContent((prev) => ({
      ...prev,
      services: prev.services.map((service) =>
        service.id === serviceId
          ? { ...service, [field]: [...service[field], ""] }
          : service
      ),
    }));
  }, []);

  const removeFromServiceArray = useCallback((serviceId, field, index) => {
    setTempContent((prev) => ({
      ...prev,
      services: prev.services.map((service) =>
        service.id === serviceId
          ? {
              ...service,
              [field]: service[field].filter((_, i) => i !== index),
            }
          : service
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
    if (categoryToRemove === "All") return;
    const defaultCategory =
      tempContent.categories.find(
        (cat) => cat !== "All" && cat !== categoryToRemove
      ) || "General";
    setTempContent((prev) => ({
      ...prev,
      categories: prev.categories.filter((cat) => cat !== categoryToRemove),
      services: prev.services.map((service) =>
        service.category === categoryToRemove
          ? { ...service, category: defaultCategory }
          : service
      ),
    }));
  };

  const EditableText = useMemo(() => {
    return ({
      value,
      onChange,
      multiline = false,
      className = "",
      placeholder = "",
    }) => {
      const baseClasses =
        "w-full bg-white border-2 border-dashed border-yellow-400 rounded focus:border-yellow-400 focus:outline-none";

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

  const EditableArray = ({ items, onChange, placeholder, title }) => (
    <div className='space-y-2'>
      <div className='flex justify-between items-center'>
        <label className='block text-xs font-medium text-gray-600'>
          {title}
        </label>
        <Button
          onClick={() => onChange([...items, ""])}
          variant='outline'
          size='sm'
          className='text-xs px-2 py-1'
        >
          <Plus className='w-3 h-3' />
        </Button>
      </div>
      {items.map((item, index) => (
        <div key={index} className='flex gap-2'>
          <EditableText
            value={item}
            onChange={(value) => {
              const newItems = [...items];
              newItems[index] = value;
              onChange(newItems);
            }}
            placeholder={placeholder}
            className='flex-1'
          />
          <Button
            onClick={() => {
              const newItems = items.filter((_, i) => i !== index);
              onChange(newItems);
            }}
            variant='outline'
            size='sm'
            className='text-red-500 hover:text-red-700 px-2'
          >
            <X className='w-3 h-3' />
          </Button>
        </div>
      ))}
    </div>
  );

  if (!content) {
    return (
      <section className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-6 text-center'>
          <div className='animate-pulse'>
            <div className='h-8 bg-gray-200 rounded w-64 mx-auto mb-4'></div>
            <div className='h-4 bg-gray-200 rounded w-96 mx-auto mb-8'></div>
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className='bg-gray-200 rounded-lg h-64'></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const displayContent = isEditing ? tempContent : content;
  const filteredServices =
    selectedCategory === "All"
      ? displayContent.services
      : displayContent.services.filter((s) => s.category === selectedCategory);

  const displayedServices = showAll
    ? filteredServices
    : filteredServices.slice(0, 4);

  return (
    <section
      ref={sectionRef}
      id='services'
      className='py-20 bg-gray-50 scroll-mt-20 relative'
    >
      {/* Edit Controls */}
      {dataLoaded && (
        <div className='absolute top-4 right-4 z-20'>
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              variant='outline'
              size='sm'
              className='bg-white hover:bg-gray-50 shadow-xl border-2 border-gray-300 hover:border-yellow-400 text-gray-700 hover:text-yellow-400'
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
        {/* Header Section */}
        <div className='text-center mb-16'>
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
              <h2 className='text-4xl font-bold text-gray-900 mb-4'>
                {displayContent.sectionTitle}
              </h2>
              <p className='text-lg text-gray-600 max-w-3xl mx-auto'>
                {displayContent.sectionDescription}
              </p>
            </>
          )}

          {/* Categories */}
          {isEditing ? (
            <div className='mt-8 space-y-4'>
              <div className='flex justify-center'>
                <Button
                  onClick={addCategory}
                  variant='outline'
                  size='sm'
                  className='bg-yellow-50 hover:bg-yellow-100 border-yellow-400 text-yellow-400'
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
            <div className='flex flex-wrap justify-center gap-4 mt-8'>
              {displayContent.categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setShowAll(false);
                  }}
                  className={`px-6 py-3 rounded-full transition-all duration-200 font-medium ${
                    selectedCategory === cat
                      ? "bg-yellow-400 text-white shadow-lg"
                      : "bg-white text-gray-600 hover:bg-gray-100 shadow-md"
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

            <div className='grid md:grid-cols-2 gap-6'>
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

                    <div className='absolute top-2 left-2'>
                      <select
                        value={service.category}
                        onChange={(e) =>
                          updateService(service.id, "category", e.target.value)
                        }
                        className='bg-yellow-400 text-white text-xs px-2 py-1 rounded border-none focus:outline-none'
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

                  <CardContent className='p-4 space-y-4'>
                    {/* Basic Info */}
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-xs font-medium text-gray-600 mb-1'>
                          Service Title
                        </label>
                        <EditableText
                          value={service.title}
                          onChange={(value) =>
                            updateService(service.id, "title", value)
                          }
                          placeholder='Service title'
                        />
                      </div>
                      <div>
                        <label className='block text-xs font-medium text-gray-600 mb-1'>
                          Pricing
                        </label>
                        <EditableText
                          value={service.pricing}
                          onChange={(value) =>
                            updateService(service.id, "pricing", value)
                          }
                          placeholder='Pricing range'
                        />
                      </div>
                    </div>

                    <div>
                      <label className='block text-xs font-medium text-gray-600 mb-1'>
                        Timeline
                      </label>
                      <EditableText
                        value={service.timeline}
                        onChange={(value) =>
                          updateService(service.id, "timeline", value)
                        }
                        placeholder='Timeline'
                      />
                    </div>

                    <div>
                      <label className='block text-xs font-medium text-gray-600 mb-1'>
                        Description
                      </label>
                      <EditableText
                        value={service.description}
                        onChange={(value) =>
                          updateService(service.id, "description", value)
                        }
                        multiline={true}
                        placeholder='Brief description'
                      />
                    </div>

                    <div>
                      <label className='block text-xs font-medium text-gray-600 mb-1'>
                        Detailed Description
                      </label>
                      <EditableText
                        value={service.detailedDescription}
                        onChange={(value) =>
                          updateService(
                            service.id,
                            "detailedDescription",
                            value
                          )
                        }
                        multiline={true}
                        placeholder='Detailed description'
                      />
                    </div>

                    {/* Features */}
                    <EditableArray
                      items={service.features}
                      onChange={(newFeatures) =>
                        updateService(service.id, "features", newFeatures)
                      }
                      placeholder='Feature description'
                      title='Features'
                    />

                    {/* Benefits */}
                    <EditableArray
                      items={service.benefits}
                      onChange={(newBenefits) =>
                        updateService(service.id, "benefits", newBenefits)
                      }
                      placeholder='Benefit description'
                      title='Benefits'
                    />

                    {/* Process */}
                    <EditableArray
                      items={service.process}
                      onChange={(newProcess) =>
                        updateService(service.id, "process", newProcess)
                      }
                      placeholder='Process step'
                      title='Process Steps'
                    />

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
          </div>
        ) : (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {displayedServices.map((service) => (
              <Card
                key={service.id}
                className='group hover:shadow-2xl transition-all duration-300 bg-white border-0 shadow-lg overflow-hidden'
              >
                <div className='relative overflow-hidden'>
                  <img
                    src={service.image}
                    alt={service.title}
                    className='w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300'
                  />
                  <Badge className='absolute top-4 left-4 bg-yellow-400 text-white shadow-lg'>
                    {service.category}
                  </Badge>
                  <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                </div>

                <CardContent className='p-6'>
                  <h3 className='text-xl font-bold mb-3 text-gray-900'>
                    {service.title}
                  </h3>
                  <p className='text-gray-600 mb-4 line-clamp-2'>
                    {service.description}
                  </p>

                  {/* Service Details */}
                  <div className='space-y-3 mb-6'>
                    <div className='flex items-center text-sm text-gray-500'>
                      <DollarSign className='w-4 h-4 mr-2 text-green-600' />
                      <span className='font-medium'>{service.pricing}</span>
                    </div>
                    <div className='flex items-center text-sm text-gray-500'>
                      <Clock className='w-4 h-4 mr-2 text-yellow-400' />
                      <span>{service.timeline}</span>
                    </div>
                  </div>

                  {/* Expandable Details */}
                  {expandedService === service.id && (
                    <div className='space-y-4 mb-4 border-t pt-4'>
                      <div>
                        <h4 className='font-semibold text-gray-900 mb-2'>
                          About This Service
                        </h4>
                        <p className='text-sm text-gray-600'>
                          {service.detailedDescription}
                        </p>
                      </div>

                      {service.features?.length > 0 && (
                        <div>
                          <h4 className='font-semibold text-gray-900 mb-2 flex items-center'>
                            <Star className='w-4 h-4 mr-1' />
                            Key Features
                          </h4>
                          <ul className='space-y-1'>
                            {service.features.map((feature, index) => (
                              <li
                                key={index}
                                className='text-sm text-gray-600 flex items-start'
                              >
                                <CheckCircle className='w-3 h-3 mr-2 mt-0.5 text-green-500 flex-shrink-0' />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {service.benefits?.length > 0 && (
                        <div>
                          <h4 className='font-semibold text-gray-900 mb-2'>
                            Benefits
                          </h4>
                          <ul className='space-y-1'>
                            {service.benefits.map((benefit, index) => (
                              <li
                                key={index}
                                className='text-sm text-gray-600 flex items-start'
                              >
                                <CheckCircle className='w-3 h-3 mr-2 mt-0.5 text-yellow-400 flex-shrink-0' />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {service.process?.length > 0 && (
                        <div>
                          <h4 className='font-semibold text-gray-900 mb-2'>
                            Our Process
                          </h4>
                          <ol className='space-y-1'>
                            {service.process.map((step, index) => (
                              <li
                                key={index}
                                className='text-sm text-gray-600 flex items-start'
                              >
                                <span className='bg-yellow-100 text-yellow-400 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mr-2 mt-0.5 flex-shrink-0'>
                                  {index + 1}
                                </span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className='flex gap-2'>
                    <Button
                      onClick={() =>
                        setExpandedService(
                          expandedService === service.id ? null : service.id
                        )
                      }
                      variant='outline'
                      className='flex-1 hover:bg-gray-50'
                    >
                      {expandedService === service.id
                        ? "Show Less"
                        : "Learn More"}
                    </Button>
                    <Button className='bg-yellow-400 hover:bg-yellow-400 text-white'>
                      Get Quote
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!isEditing && !showAll && filteredServices.length > 4 && (
          <div className='text-center mt-12'>
            <Button
              onClick={() => setShowAll(true)}
              className='px-8 py-3 bg-yellow-400 hover:bg-yellow-400 text-white shadow-lg'
            >
              View All Services
            </Button>
          </div>
        )}
      </div>

      {/* Editing Instructions */}
      {isEditing && (
        <div className='max-w-7xl mx-auto px-6 mt-8'>
          <div className='bg-yellow-50 border border-yellow-400 rounded-lg p-4'>
            <p className='text-sm text-yellow-400 text-center'>
              <strong>Edit Mode:</strong> Modify service details, add/remove
              features, benefits, and process steps. Use the category dropdown
              to assign services to different categories. Upload new images by
              clicking the "Change" button.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
