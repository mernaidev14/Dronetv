import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, useMotionValue } from "framer-motion";
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
  Star,
} from "lucide-react";
import { Button } from "../components/ui/button";

export default function EditableProducts({ productData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selected, setSelected] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef(null);
  const fileInputRefs = useRef({});
  const containerRef = useRef(null);

  // Extract data from productData prop or use defaults
  const defaultContent = useMemo(() => {
    if (productData) {
      // Get unique categories from products
      const categories = [
        "All",
        ...new Set(productData.products.map((p) => p.category)),
      ];

      return {
        sectionTitle: productData.heading?.title || "Products",
        sectionSubtitle: productData.heading?.heading || "Our Products",
        sectionDescription:
          productData.heading?.description ||
          "Discover our suite of innovative products.",
        trustText: productData.heading?.trust || "",
        products: productData.products.map((product, index) => ({
          id: index + 1,
          image: product.image,
          title: product.title,
          description: product.description,
          detailedDescription: product.detailedDescription,
          category: product.category,
          features: product.features || [],
          isPopular: product.isPopular || false,
          categoryColor: product.categoryColor || "bg-gray-100 text-gray-800",
          pricing: product.pricing,
          timeline: product.timeline,
        })),
        categories: categories,
        benefits: productData.benefits || [],
      };
    }

    // Fallback default content
    return {
      sectionTitle: "Products",
      sectionSubtitle: "Our Products",
      sectionDescription: "Discover our suite of innovative products.",
      trustText: "",
      products: [],
      categories: ["All"],
      benefits: [],
    };
  }, [productData]);

  const [content, setContent] = useState(defaultContent);
  const [tempContent, setTempContent] = useState(defaultContent);

  const x = useMotionValue(0);
  const speed = 0.5;

  // Update content when productData changes
  useEffect(() => {
    if (productData) {
      setContent(defaultContent);
      setTempContent(defaultContent);
      setDataLoaded(true);
    }
  }, [productData, defaultContent]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => sectionRef.current && observer.unobserve(sectionRef.current);
  }, []);

  const fetchProductsData = async () => {
    setIsLoading(true);
    try {
      // If we have productData, use it directly
      if (productData) {
        setContent(defaultContent);
        setTempContent(defaultContent);
        setDataLoaded(true);
      }
    } catch (error) {
      console.error("Error fetching products data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProductsData = async (updatedContent) => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error("Error saving products data:", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (isVisible && !dataLoaded && !isLoading && !productData) {
      fetchProductsData();
    }
  }, [isVisible, dataLoaded, isLoading, productData]);

  const displayContent = isEditing ? tempContent : content;
  const filtered =
    selected === "All"
      ? displayContent.products
      : displayContent.products.filter((p) => p.category === selected);
  const duplicated = showAll ? filtered : [...filtered, ...filtered];

  // Reset animation position when filter changes
  useEffect(() => {
    x.set(0);
  }, [selected, x]);

  useEffect(() => {
    if (showAll || isEditing) return;
    let animationFrame;
    const animate = () => {
      if (!isHovered) {
        x.set(x.get() - speed);
        if (Math.abs(x.get()) >= (duplicated.length / 2) * 320) x.set(0);
      }
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [isHovered, x, duplicated.length, showAll, isEditing, selected]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempContent(content);
  };

  const handleSave = async () => {
    const success = await saveProductsData(tempContent);
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

  const handleImageUpload = (productId, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempContent((prev) => ({
          ...prev,
          products: prev.products.map((product) =>
            product.id === productId
              ? { ...product, image: e.target.result }
              : product
          ),
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addProduct = () => {
    const newId = Math.max(...tempContent.products.map((p) => p.id), 0) + 1;
    setTempContent((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        {
          id: newId,
          title: "New Product",
          description: "Product description",
          category: "Technology",
          image:
            "https://images.unsplash.com/photo-1473968512647-3e447244af8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
          features: ["Feature 1", "Feature 2"],
          isPopular: false,
          categoryColor: "bg-gray-100 text-gray-800",
          pricing: "Contact for pricing",
          timeline: "TBD",
        },
      ],
    }));
  };

  const removeProduct = (productId) => {
    setTempContent((prev) => ({
      ...prev,
      products: prev.products.filter((product) => product.id !== productId),
    }));
  };

  const updateProduct = useCallback((productId, field, value) => {
    setTempContent((prev) => ({
      ...prev,
      products: prev.products.map((product) =>
        product.id === productId ? { ...product, [field]: value } : product
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
    setTempContent((prev) => ({
      ...prev,
      categories: prev.categories.filter((cat) => cat !== categoryToRemove),
      products: prev.products.map((product) =>
        product.category === categoryToRemove
          ? { ...product, category: "Technology" }
          : product
      ),
    }));
  };

  const EditableText = useMemo(
    () =>
      ({
        value,
        onChange,
        multiline = false,
        className = "",
        placeholder = "",
      }) => {
        const baseClasses =
          "w-full bg-white border-2 border-dashed border-yellow-400 rounded focus:border-yellow-500 focus:outline-none";
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
      },
    []
  );

  const renderBenefits = () => {
    if (!displayContent.benefits || displayContent.benefits.length === 0)
      return null;

    return (
      <div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-8'>
        {displayContent.benefits.map((benefit, index) => (
          <div
            key={index}
            className='text-center p-6 bg-white rounded-lg shadow-sm'
          >
            <div
              className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 text-2xl font-bold
              ${
                benefit.color === "red-accent"
                  ? "bg-red-100 text-red-600"
                  : benefit.color === "primary"
                  ? "bg-yellow-100 text-yellow-400"
                  : "bg-gradient-to-r from-purple-500 to-yellow-400 text-white"
              }`}
            >
              {benefit.icon}
            </div>
            <h4 className='font-semibold text-lg mb-2'>{benefit.title}</h4>
            <p className='text-gray-600 text-sm'>{benefit.desc}</p>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <section className='max-w-7xl mx-auto py-20 bg-gray-50'>
        <div className='container mx-auto px-4 text-center'>
          <Loader2 className='w-8 h-8 animate-spin mx-auto mb-4' />
          <p>Loading products...</p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className='max-w-7xl mx-auto py-20 bg-gray-50 relative overflow-hidden'
    >
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center mb-8'>
          <div>
            {isEditing ? (
              <EditableText
                value={tempContent.sectionTitle}
                onChange={(val) =>
                  setTempContent({ ...tempContent, sectionTitle: val })
                }
                className='text-4xl font-bold mb-2'
              />
            ) : (
              <h2 className='text-4xl font-bold mb-2'>
                {displayContent.sectionTitle}
              </h2>
            )}

            {isEditing ? (
              <EditableText
                value={tempContent.sectionSubtitle}
                onChange={(val) =>
                  setTempContent({ ...tempContent, sectionSubtitle: val })
                }
                className='text-2xl font-semibold mb-2'
              />
            ) : (
              <h3 className='text-2xl font-semibold mb-2'>
                {displayContent.sectionSubtitle}
              </h3>
            )}

            {isEditing ? (
              <EditableText
                value={tempContent.sectionDescription}
                onChange={(val) =>
                  setTempContent({ ...tempContent, sectionDescription: val })
                }
                className='text-gray-600'
              />
            ) : (
              <p className='text-gray-600'>
                {displayContent.sectionDescription}
                {displayContent.trustText && (
                  <span className='font-semibold text-yellow-400'>
                    {" "}
                    {displayContent.trustText}
                  </span>
                )}
              </p>
            )}
          </div>

          <div className='flex gap-2'>
            {!isEditing && (
              <Button onClick={handleEdit} variant='outline'>
                <Edit2 className='w-4 h-4 mr-2' /> Edit
              </Button>
            )}
            {isEditing && (
              <>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  ) : (
                    <Save className='w-4 h-4 mr-2' />
                  )}
                  Save
                </Button>
                <Button onClick={handleCancel} variant='outline'>
                  <X className='w-4 h-4 mr-2' /> Cancel
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className='flex flex-wrap gap-2 mb-6'>
          {displayContent.categories.map((cat) => (
            <Badge
              key={cat}
              onClick={() => setSelected(cat)}
              className={`cursor-pointer px-4 py-2 rounded-full ${
                selected === cat ? "bg-yellow-400 text-white" : "bg-gray-200"
              }`}
            >
              {cat}
              {isEditing && cat !== "All" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCategory(cat);
                  }}
                  className='ml-2 text-xs text-red-600'
                >
                  ✕
                </button>
              )}
            </Badge>
          ))}
          {isEditing && (
            <Button onClick={addCategory} size='sm' variant='outline'>
              <Plus className='w-4 h-4 mr-1' /> Add Category
            </Button>
          )}
        </div>
      </div>

      {/* Full-width animation container with constrained content */}
      <div className='w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] relative'>
        <div
          ref={containerRef}
          className='w-full overflow-hidden'
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div className='flex space-x-6 pl-6' style={{ x }}>
            {duplicated.map((product, index) => (
              <Card
                key={`${product.id}-${index}`}
                className='min-w-[320px] shadow-md rounded-xl overflow-hidden relative'
              >
                {product.isPopular && (
                  <div className='absolute top-4 right-4 z-10'>
                    <Badge className='bg-yellow-400 text-white'>
                      <Star className='w-3 h-3 mr-1' fill='currentColor' />
                      Popular
                    </Badge>
                  </div>
                )}

                <CardContent className='p-0'>
                  <div className='relative'>
                    <img
                      src={product.image}
                      alt={product.title}
                      className='w-full h-48 object-cover'
                    />
                    {isEditing && (
                      <>
                        <input
                          type='file'
                          accept='image/*'
                          ref={(el) => (fileInputRefs.current[product.id] = el)}
                          onChange={(e) => handleImageUpload(product.id, e)}
                          className='hidden'
                        />
                        <Button
                          size='sm'
                          variant='outline'
                          className='absolute top-2 right-2'
                          onClick={() =>
                            fileInputRefs.current[product.id]?.click()
                          }
                        >
                          <Upload className='w-4 h-4' />
                        </Button>
                      </>
                    )}
                  </div>

                  <div className='p-6'>
                    <div className='flex items-center justify-between mb-3'>
                      <Badge
                        className={
                          product.categoryColor || "bg-gray-100 text-gray-800"
                        }
                      >
                        {product.category}
                      </Badge>
                    </div>

                    {isEditing ? (
                      <EditableText
                        value={product.title}
                        onChange={(val) =>
                          updateProduct(product.id, "title", val)
                        }
                        className='text-xl font-bold mb-3'
                      />
                    ) : (
                      <h3 className='text-xl font-bold mb-3'>
                        {product.title}
                      </h3>
                    )}

                    {isEditing ? (
                      <EditableText
                        value={product.description}
                        onChange={(val) =>
                          updateProduct(product.id, "description", val)
                        }
                        multiline
                        className='text-gray-600 mb-4'
                      />
                    ) : (
                      <p className='text-gray-600 mb-4'>
                        {product.description}
                      </p>
                    )}

                    {product.features && product.features.length > 0 && (
                      <div className='mb-4'>
                        <h4 className='font-semibold mb-2 text-sm'>
                          Features:
                        </h4>
                        <ul className='text-sm text-gray-600 space-y-1'>
                          {product.features.map((feature, idx) => (
                            <li key={idx} className='flex items-center'>
                              <div className='w-1.5 h-1.5 bg-yellow-400 rounded-full mr-2'></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {(product.pricing || product.timeline) && (
                      <div className='border-t pt-4 mt-4'>
                        {product.pricing && (
                          <p className='font-semibold text-yellow-400 mb-1'>
                            {product.pricing}
                          </p>
                        )}
                        {product.timeline && (
                          <p className='text-sm text-gray-500'>
                            {product.timeline}
                          </p>
                        )}
                      </div>
                    )}

                    {isEditing && (
                      <Button
                        onClick={() => removeProduct(product.id)}
                        size='sm'
                        variant='destructive'
                        className='mt-3 w-full'
                      >
                        <Trash2 className='w-4 h-4 mr-1' /> Delete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </div>

      <div className='container mx-auto px-4'>
        {isEditing && (
          <Button onClick={addProduct} size='sm' className='mt-6'>
            <Plus className='w-4 h-4 mr-1' /> Add Product
          </Button>
        )}

        {/* Benefits Section */}
        {renderBenefits()}
      </div>
    </section>
  );
}
