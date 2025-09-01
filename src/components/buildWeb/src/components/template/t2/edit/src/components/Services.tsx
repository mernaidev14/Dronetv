import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { X, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Services({serviceData}) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedServiceIndex, setSelectedServiceIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
         
  // Merged all state into a single object
  
  const [servicesSection, setServicesSection] = useState(
    serviceData
  );

  // Get categories from services
  const filteredServices =
    activeCategory === "All"
      ? servicesSection.services
      : servicesSection.services.filter((s) => s.category === activeCategory);

  const visibleServices = filteredServices.slice(0, visibleCount);

  // Handlers
  const updateServiceField = (index: number, field: string, value: any) => {
    setServicesSection(prev => ({
      ...prev,
      services: prev.services.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    }));
    
    // Update categories if needed
    if (field === "category" && !servicesSection.categories.includes(value)) {
      setServicesSection(prev => ({
        ...prev,
        categories: [...prev.categories, value]
      }));
    }
  };

  const updateServiceList = (
    index: number,
    field: "features" | "benefits" | "process",
    listIndex: number,
    value: string
  ) => {
    setServicesSection(prev => ({
      ...prev,
      services: prev.services.map((s, i) =>
        i === index
          ? {
              ...s,
              [field]: s[field].map((item: string, li: number) =>
                li === listIndex ? value : item
              ),
            }
          : s
      )
    }));
  };

  const addToList = (index: number, field: "features" | "benefits" | "process") => {
    setServicesSection(prev => ({
      ...prev,
      services: prev.services.map((s, i) =>
        i === index ? { ...s, [field]: [...s[field], "New Item"] } : s
      )
    }));
  };

  const removeFromList = (
    index: number,
    field: "features" | "benefits" | "process",
    listIndex: number
  ) => {
    setServicesSection(prev => ({
      ...prev,
      services: prev.services.map((s, i) =>
        i === index
          ? {
              ...s,
              [field]: s[field].filter((_: string, li: number) => li !== listIndex),
            }
          : s
      )
    }));
  };

  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateServiceField(index, "image", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addService = () => {
    const newService = {
      title: "New Service",
      category: "New Category",
      image: "https://via.placeholder.com/600x400?text=New+Service",
      description: "Service description goes here...",
      features: ["New Feature"],
      detailedDescription: "Detailed description for the new service...",
      benefits: ["New Benefit"],
      process: ["New Step"],
      pricing: "Custom pricing",
      timeline: "TBD",
    };
    
    setServicesSection(prev => ({
      ...prev,
      services: [...prev.services, newService]
    }));
    
    if (!servicesSection.categories.includes("New Category")) {
      setServicesSection(prev => ({
        ...prev,
        categories: [...prev.categories, "New Category"]
      }));
    }
  };

  const removeService = (index: number) => {
    setServicesSection(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const addCategory = () => {
    const newCategory = `New Category ${servicesSection.categories.length}`;
    if (!servicesSection.categories.includes(newCategory)) {
      setServicesSection(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory]
      }));
    }
  };

  const removeCategory = (cat: string) => {
    if (cat !== "All") {
      setServicesSection(prev => ({
        ...prev,
        categories: prev.categories.filter((c) => c !== cat),
        services: prev.services.map((s) => 
          s.category === cat ? { ...s, category: "Uncategorized" } : s
        )
      }));
    }
  };

  const openModal = (service: any, index: number) => {
    setSelectedServiceIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedServiceIndex(null);
  };

  return (
    <motion.section id="services" className="py-20 bg-background theme-transition">
      <div className="max-w-7xl mx-auto px-4">
        {/* Edit/Save Buttons */}
        <div className="flex justify-end mt-6">
         {isEditing ? (
            <motion.button 
            whileTap={{scale:0.9}}
            whileHover={{y:-1,scaleX:1.1}}
            onClick={() => setIsEditing(false)} className="bg-green-600 cursor-pointer hover:font-semibold hover:shadow-2xl shadow-xl text-white px-4 py-2 rounded">Save</motion.button>
          ) : (
            <motion.button 
            whileTap={{scale:0.9}}
            whileHover={{y:-1,scaleX:1.1}}
            onClick={() => setIsEditing(true)} className="bg-yellow-500 text-black px-4 py-2 rounded cursor-pointer  hover:shadow-2xl shadow-xl hover:font-semibold">Edit</motion.button>
          )}
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          {isEditing ? (
            <>
              <input 
                type="text" 
                className="text-3xl font-bold block text-center w-full"  
                value={servicesSection.heading.head} 
                onChange={(e) => setServicesSection(prev => ({
                  ...prev,
                  heading: {...prev.heading, head: e.target.value}
                }))}
              />
              <input 
                type="text" 
                className="text-muted-foreground block w-full text-center" 
                value={servicesSection.heading.desc} 
                onChange={(e) => setServicesSection(prev => ({
                  ...prev,
                  heading: {...prev.heading, desc: e.target.value}
                }))}
              />
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold">{servicesSection.heading.head}</h2>
              <p className="text-muted-foreground">{servicesSection.heading.desc}</p>
            </>
          )}          
        </div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {servicesSection.categories.map((cat, i) => (
            <div key={i} className="flex items-center gap-2">
              {isEditing ? (
                <input
                  value={cat}
                  onChange={(e) =>
                    setServicesSection(prev => ({
                      ...prev,
                      categories: prev.categories.map((c, idx) => 
                        idx === i ? e.target.value : c
                      )
                    }))
                  }
                  className="border-b px-2"
                />
              ) : (
                <Button
                  onClick={() => {
                    setActiveCategory(cat);
                    setVisibleCount(6); // reset load more
                  }}
                  className={
                    activeCategory === cat
                      ? "bg-primary cursor-pointer text-white"
                      : "bg-card text-card-foreground cursor-pointer"
                  }
                >
                  {cat}
                </Button>
              )}
              {isEditing && cat !== "All" && (
                <button
                  onClick={() => removeCategory(cat)}
                  className="text-red-500 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          {isEditing && (
            <motion.button
             whileTap={{scale:0.9}}
             whileHover={{scale:1.1}}
              onClick={addCategory}
              className="text-green-600 text-sm font-medium"
            >
              + Add Category
            </motion.button>
          )}
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleServices.map((service, index) => (
            <Card key={index} className="relative">
              <div className="h-40 overflow-hidden relative">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                {isEditing && (
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute bottom-2 left-2 text-xs bg-white rounded-xl px-5 py-1 w-[50%]"
                    onChange={(e) => handleImageUpload(index, e)}
                  />
                )}
              </div>
              <CardHeader>
                {isEditing ? (
                  <input
                    value={service.title}
                    onChange={(e) =>
                      updateServiceField(index, "title", e.target.value)
                    }
                    className="border-b w-full"
                  />
                ) : (
                  <CardTitle>{service.title}</CardTitle>
                )}
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <>
                    <textarea
                      value={service.description}
                      onChange={(e) =>
                        updateServiceField(index, "description", e.target.value)
                      }
                      className="border-b w-full"
                    />
                    <input
                      value={service.category}
                      onChange={(e) =>
                        updateServiceField(index, "category", e.target.value)
                      }
                      className="border-b w-full mt-2"
                    />
                  </>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      {service.description}
                    </p>
                    <p className="text-xs mt-1 italic text-gray-500">
                      Category: {service.category}
                    </p>
                  </>
                )}

                <div className="mt-4 flex gap-2">
                  <Button className="cursor-pointer hover:scale-105" size="sm" onClick={() => openModal(service, index)}>
                    View Details
                  </Button>
                  {isEditing && (
                    <Button
                    className="cursor-pointer hover:scale-105"
                      size="sm"
                      variant="destructive"
                      onClick={() => removeService(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {isEditing && (
            <Card className="flex items-center justify-center border-dashed">
              <Button onClick={addService} className="text-green-600 cursor-pointer hover:scale-105">
                + Add Service
              </Button>
            </Card>
          )}
        </div>

        {/* Load More & Show Less */}
        <div className="flex justify-center mt-6">
          {visibleCount < filteredServices.length && (
            <Button onClick={() => setVisibleCount((prev) => prev + 6)}>
              Load More
            </Button>
          )}
          {visibleCount >= filteredServices.length && filteredServices.length > 3 && (
            <Button
              onClick={() => setVisibleCount(3)}
              variant="secondary"
              className="ml-4"
            >
              Show Less
            </Button>
          )}
        </div>

        
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && selectedServiceIndex !== null && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <div
              className="bg-card rounded-xl w-full max-w-3xl p-6 relative top-16 h-180 z-100 overflow-y-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-gray-500 rounded-full p-2"
              >
                <X className="w-5 h-5" />
              </button>

              {isEditing ? (
                <input
                  value={servicesSection.services[selectedServiceIndex].title}
                  onChange={(e) =>
                    updateServiceField(selectedServiceIndex, "title", e.target.value)
                  }
                  className="border-b w-full text-2xl font-bold mb-4"
                />
              ) : (
                <h2 className="text-2xl font-bold mb-4">{servicesSection.services[selectedServiceIndex].title}</h2>
              )}

              {isEditing ? (
                <textarea
                  value={servicesSection.services[selectedServiceIndex].detailedDescription}
                  onChange={(e) =>
                    updateServiceField(selectedServiceIndex, "detailedDescription", e.target.value)
                  }
                  className="border-b w-full mb-4"
                />
              ) : (
                <p className="text-muted-foreground mb-4">
                  {servicesSection.services[selectedServiceIndex].detailedDescription}
                </p>
              )}

              {/* Benefits */}
              <h3 className="font-semibold mb-2">Key Benefits</h3>
              <ul className="space-y-2 mb-4">
                {servicesSection.services[selectedServiceIndex].benefits.map((b: string, bi: number) => (
                  <li key={bi} className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                    {isEditing ? (
                      <div className="flex flex-col gap-1 w-full">
                        <input
                          value={b}
                          onChange={(e) =>
                            updateServiceList(selectedServiceIndex, "benefits", bi, e.target.value)
                          }
                          className="border-b w-full"
                        />
                        <motion.button
                        whileHover={{scale:1.1}}
                     whileTap={{scale:0.9}}
                          onClick={() =>
                            removeFromList(selectedServiceIndex, "benefits", bi)
                          }
                          className="text-xs text-red-500"
                        >
                          ✕ Remove
                        </motion.button>
                      </div>
                    ) : (
                      <span>{b}</span>
                    )}
                  </li>
                ))}
              </ul>
              {isEditing && (
                <button
                  onClick={() =>
                    addToList(selectedServiceIndex, "benefits")
                  }
                  className="text-xs text-green-600 mb-4"
                >
                  + Add Benefit
                </button>
              )}

              {/* Process */}
              <h3 className="font-semibold mb-2">Our Process</h3>
              <ol className="space-y-2 mb-4">
                {servicesSection.services[selectedServiceIndex].process.map((p: string, pi: number) => (
                  <li key={pi}>
                    {isEditing ? (
                      <div className="flex flex-col gap-1 w-full">
                        <input
                          value={p}
                          onChange={(e) =>
                            updateServiceList(selectedServiceIndex, "process", pi, e.target.value)
                          }
                          className="border-b w-full"
                        />
                        <motion.button
                        whileHover={{scale:1.1}}
                     whileTap={{scale:0.9}}
                          onClick={() =>
                            removeFromList(selectedServiceIndex, "process", pi)
                          }
                          className="text-xs text-red-500"
                        >
                          ✕ Remove
                        </motion.button>
                      </div>
                    ) : (
                      <span>{p}</span>
                    )}
                  </li>
                ))}
              </ol>
              {isEditing && (
                <motion.button
                whileHover={{scale:1.1}}
                     whileTap={{scale:0.9}}
                  onClick={() =>
                    addToList(selectedServiceIndex, "process")
                  }
                  className="text-xs text-green-600 mb-4"
                >
                  + Add Step
                </motion.button>
              )}

              {/* Pricing & Timeline */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Pricing</h3>
                  {isEditing ? (
                    <input
                      value={servicesSection.services[selectedServiceIndex].pricing}
                      onChange={(e) =>
                        updateServiceField(selectedServiceIndex, "pricing", e.target.value)
                      }
                      className="border-b w-full"
                    />
                  ) : (
                    <p>{servicesSection.services[selectedServiceIndex].pricing}</p>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Timeline</h3>
                  {isEditing ? (
                    <input
                      value={servicesSection.services[selectedServiceIndex].timeline}
                      onChange={(e) =>
                        updateServiceField(selectedServiceIndex, "timeline", e.target.value)
                      }
                      className="border-b w-full"
                    />
                  ) : (
                    <p>{servicesSection.services[selectedServiceIndex].timeline}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}