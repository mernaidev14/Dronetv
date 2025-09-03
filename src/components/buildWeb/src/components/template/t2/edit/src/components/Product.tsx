import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Monitor,
  Smartphone,
  Cloud,
  BarChart3,
  Zap,
  X,
  CheckCircle,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion, AnimatePresence } from "motion/react";

export default function Product({productData, onStateChange}) {
  const [isEditing, setIsEditing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Consolidated state
  const [contentState, setContentState] = useState(productData);

    // Add this useEffect to notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(contentState);
    }
  }, [contentState, onStateChange]);

  // Update function for simple fields
  const updateField = (section, field, value) => {
    setContentState(prev => ({ 
      ...prev, 
      [section]: { ...prev[section], [field]: value } 
    }));
  };

  // Update function for products
  const updateProductField = (index, field, value) => {
    setContentState(prev => ({
      ...prev,
      products: prev.products.map((p, i) => i === index ? { ...p, [field]: value } : p)
    }));
  };

  // Update function for product features
  const updateFeature = (index, fIndex, value) => {
    setContentState(prev => ({
      ...prev,
      products: prev.products.map((p, i) =>
        i === index
          ? {
              ...p,
              features: p.features.map((f, fi) => fi === fIndex ? value : f)
            }
          : p
      )
    }));
  };

  // Add a new feature to a product
  const addFeature = (index) => {
    setContentState(prev => ({
      ...prev,
      products: prev.products.map((p, i) =>
        i === index ? { ...p, features: [...p.features, "New Feature"] } : p
      )
    }));
  };

  // Remove a feature from a product
  const removeFeature = (index, fIndex) => {
    setContentState(prev => ({
      ...prev,
      products: prev.products.map((p, i) =>
        i === index
          ? {
              ...p,
              features: p.features.filter((_, fi) => fi !== fIndex)
            }
          : p
      )
    }));
  };

  // Handle image upload for a product
  // Handle image upload for a product
const handleImageUpload = (index, e) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Create a new array with the updated product
      const updatedProducts = [...contentState.products];
      updatedProducts[index] = {
        ...updatedProducts[index],
        image: reader.result
      };
      
      // Update the state
      setContentState(prev => ({
        ...prev,
        products: updatedProducts
      }));
    };
    reader.readAsDataURL(file);
  }
};

  // Add a new product
const addProduct = () => {
  setContentState(prev => ({
    ...prev,
    products: [
      ...prev.products,
      {
        icon: Monitor,
        title: "New Product",
        category: "New Category",
        image: null, // Set to null instead of a placeholder URL
        description: "New product description...",
        features: ["New Feature"],
        isPopular: false,
        categoryColor: "bg-gray-100 text-gray-800",
        detailedDescription: "Detailed description for new product...",
        pricing: "TBD",
        timeline: "TBD",
      },
    ]
  }));
};

  // Remove a product
  const removeProduct = (index) => {
    setContentState(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  // Update function for benefits
  const updateBenefit = (index, field, value) => {
    setContentState(prev => ({
      ...prev,
      benefits: prev.benefits.map((b, i) => i === index ? { ...b, [field]: value } : b)
    }));
  };

  // Add a new benefit
  const addBenefit = () => {
    setContentState(prev => ({
      ...prev,
      benefits: [
        ...prev.benefits,
        {
          icon: "",
          color: "primary",
          title: "New Benefit",
          desc: "Benefit description...",
        },
      ]
    }));
  };

  // Remove a benefit
  const removeBenefit = (index) => {
    setContentState(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const openModal = (index) => {
    setSelectedProductIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProductIndex(null);
  };

  return (
    <motion.section
      id="product"
      className="py-20 bg-secondary theme-transition"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="text-center max-w-3xl mx-auto mb-16">
          {isEditing ? (
            <>
              <div className="inline-flex items-center px-4 py-2 bg-red-accent/10 rounded-full text-red-accent mb-4">
                <Zap className="w-4 h-4 mr-2" />
                <input
                  type="text"
                  value={contentState.heading.title}
                  onChange={(e) => updateField("heading", "title", e.target.value)}
                  className="border-b font-medium bg-transparent"
                />
              </div>

              <input
                type="text"
                value={contentState.heading.heading}
                onChange={(e) => updateField("heading", "heading", e.target.value)}
                className="border-b font-medium bg-transparent block w-full text-3xl md:text-4xl text-foreground mb-4"
              />
              <input
                type="text"
                className="border-b font-medium bg-transparent block w-full text-3xl md:text-4xl text-foreground mb-4"
                value={contentState.heading.description}
                onChange={(e) => updateField("heading", "description", e.target.value)}
              />

              <input
                type="text"
                value={contentState.heading.trust}
                onChange={(e) => updateField("heading", "trust", e.target.value)}
                className="border-b font-medium bg-transparent block w-full text-3xl md:text-4xl text-foreground mb-4"
              />
            </>
          ) : (
            <>
              <div className="inline-flex items-center px-4 py-2 bg-red-accent/10 rounded-full text-red-accent mb-4">
                <Zap className="w-4 h-4 mr-2" />
                <span className="font-medium"> {contentState.heading.title}</span>
              </div>
              <h2 className="text-3xl md:text-4xl text-foreground mb-4">
                {contentState.heading.heading}
              </h2>

              <p className="text-lg text-muted-foreground inline">
                {contentState.heading.description}
              </p>
              <p className="text-lg text-muted-foreground inline font-bold text-foreground">
                {" "}
                {contentState.heading.trust}
              </p>
            </>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contentState.products.slice(0, visibleCount).map((product, index) => {
              return (
              <Card
                key={index}
                className="group h-full relative overflow-hidden"
              >
                <div className="relative h-32 overflow-hidden">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  {isEditing && (
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute bottom-2 px-5 py-1 w-[70%] inline z-10 text-black hover:text-white hover:bg-black bg-gray-200 rounded-xl left-2 text-xs"
                      onChange={(e) => handleImageUpload(index, e)}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute top-2 left-2">
                    <Badge
                      className={`${product.categoryColor} border-0 text-xs`}
                    >
                      {isEditing ? (
                        <input
                          value={product.category}
                          onChange={(e) =>
                            updateProductField(index, "category", e.target.value)
                          }
                          className="border-b text-xs bg-transparent"
                        />
                      ) : (
                        product.category
                      )}
                    </Badge>
                  </div>
                  {product.isPopular && (
                    <div className="absolute top-2 right-2 bg-red-accent text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <Zap className="w-2 h-2 mr-1" /> Bestseller
                    </div>
                  )}
                  
                </div>
                <CardHeader>
                  {isEditing ? (
                    <input
                      value={product.title}
                      onChange={(e) =>
                        updateProductField(index, "title", e.target.value)
                      }
                      className="border-b w-full"
                    />
                  ) : (
                    <CardTitle>{product.title}</CardTitle>
                  )}
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <textarea
                      value={product.description}
                      onChange={(e) =>
                        updateProductField(index, "description", e.target.value)
                      }
                      className="border-b w-full"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {product.description}
                    </p>
                  )}
                  <ul className="space-y-1 mt-3">
                    {product.features.map((f, fi) => (
                      <li
                        key={fi}
                        className="text-xs text-muted-foreground flex items-center"
                      >
                        <div className="w-1 h-1 bg-primary rounded-full mr-2" />
                        {isEditing ? (
                          <div className="flex flex-col gap-1 w-full">
                            <input
                              value={f}
                              onChange={(e) =>
                                updateFeature(index, fi, e.target.value)
                              }
                              className="border-b w-full"
                            />
                            <motion.button
                            whileHover={{scale:1.1}}
                     whileTap={{scale:0.9}}
                              onClick={() => removeFeature(index, fi)}
                              className="text-xs cursor-pointer text-red-500"
                            >
                              ✕ Remove
                            </motion.button>
                          </div>
                        ) : (
                          <span>{f}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                  {isEditing && (
                    <motion.button
                     whileHover={{scale:1.1}}
                     whileTap={{scale:0.9}}
                      onClick={() => addFeature(index)}
                      className="text-xs text-green-600 mt-2"
                    >
                      + Add Feature
                    </motion.button>
                  )}
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" className="hover:scale-105" onClick={() => openModal(index)}>
                      View Details
                    </Button>
                    {isEditing && (
                      <Button
                        size="sm"
                        className="hover:scale-105"
                        variant="destructive"
                        onClick={() => removeProduct(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {isEditing && (
            <Card className=" flex items-center justify-center border-dashed">
              <Button onClick={addProduct} className="hover:scale-105 text-green-600">
                + Add Product
              </Button>
            </Card>
          )}
        </div>

        {/* Load More / Show Less */}
        <div className="flex justify-center mt-6">
          {visibleCount < contentState.products.length && (
            <Button onClick={() => setVisibleCount((prev) => prev + 4)}>
              Load More
            </Button>
          )}
          {visibleCount >= contentState.products.length && contentState.products.length > 4 && (
            <Button
              onClick={() => setVisibleCount(4)}
              variant="secondary"
              className="ml-4"
            >
              Show Less
            </Button>
          )}
        </div>

        

        {/* Benefits */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {contentState.benefits.map((benefit, index) => (
            <div key={index} className="text-center h-50 group cursor-pointer">
              <div
                className={`w-10 h-10 ${
                  benefit.color === "gradient"
                    ? "bg-gradient-to-r from-red-accent to-primary"
                    : `bg-${benefit.color}`
                } rounded-xl flex items-center justify-center mx-auto mb-3`}
              >
                {isEditing ? (
                  <input
                    value={benefit.icon}
                    onChange={e => updateBenefit(index, "icon", e.target.value)}
                    className="font-bold text-sm text-white bg-transparent text-center w-8"
                  />
                ) : (
                  <span className="font-bold text-sm text-white">{benefit.icon}</span>
                )}
              </div>
              {isEditing ? (
                <>
                  <input
                    value={benefit.title}
                    onChange={e => updateBenefit(index, "title", e.target.value)}
                    className="font-semibold text-foreground mb-2 text-sm w-full text-center border-b bg-transparent"
                  />
                  <input
                    value={benefit.desc}
                    onChange={e => updateBenefit(index, "desc", e.target.value)}
                    className="text-muted-foreground text-xs leading-relaxed w-full text-center border-b bg-transparent"
                  />
                  <select
                    value={benefit.color}
                    onChange={e => updateBenefit(index, "color", e.target.value)}
                    className="mt-2 text-xs"
                  >
                    <option value="red-accent">Red</option>
                    <option value="primary">Primary</option>
                    <option value="gradient">Gradient</option>
                    <option value="orange">Orange</option>
                    <option value="green">Green</option>
                    {/* Add more as needed */}
                  </select>
                  <button
                    onClick={() => removeBenefit(index)}
                    className="text-xs text-red-500 mt-2"
                  >
                    ✕ Remove
                  </button>
                </>
              ) : (
                <>
                  <h4 className="font-semibold text-foreground mb-2 text-sm">
                    {benefit.title}
                  </h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {benefit.desc}
                  </p>
                </>
              )}
            </div>
          ))}
          {isEditing && (
            <div className="flex items-center justify-center">
              <button
                onClick={addBenefit}
                className="text-green-600 text-sm font-medium"
              >
                + Add Benefit
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && selectedProductIndex !== null && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <div
              className="bg-card rounded-xl w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-white rounded-full p-2"
              >
                <X className="w-5 h-5" />
              </button>

              {isEditing ? (
                <input
                  value={contentState.products[selectedProductIndex].title}
                  onChange={(e) =>
                    updateProductField(selectedProductIndex, "title", e.target.value)
                  }
                  className="border-b w-full text-2xl font-bold mb-4"
                />
              ) : (
                <h2 className="text-2xl font-bold mb-4">
                  {contentState.products[selectedProductIndex].title}
                </h2>
              )}

              {isEditing ? (
                <textarea
                  value={contentState.products[selectedProductIndex].detailedDescription}
                  onChange={(e) =>
                    updateProductField(selectedProductIndex, "detailedDescription", e.target.value)
                  }
                  className="border-b w-full mb-4"
                />
              ) : (
                <p className="text-muted-foreground mb-4">
                  {contentState.products[selectedProductIndex].detailedDescription}
                </p>
              )}

              {/* Pricing & Timeline */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Pricing</h3>
                  {isEditing ? (
                    <input
                      value={contentState.products[selectedProductIndex].pricing}
                      onChange={(e) =>
                        updateProductField(selectedProductIndex, "pricing", e.target.value)
                      }
                      className="border-b w-full"
                    />
                  ) : (
                    <p>{contentState.products[selectedProductIndex].pricing}</p>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Timeline</h3>
                  {isEditing ? (
                    <input
                      value={contentState.products[selectedProductIndex].timeline}
                      onChange={(e) =>
                        updateProductField(selectedProductIndex, "timeline", e.target.value)
                      }
                      className="border-b w-full"
                    />
                  ) : (
                    <p>{contentState.products[selectedProductIndex].timeline}</p>
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
