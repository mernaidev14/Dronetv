import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, useMotionValue } from "framer-motion";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Edit2, Save, X, Upload, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import Product1 from "../public/images/Product/Product1.jpg";
import Product2 from "../public/images/Product/Product2.jpg";
import Product3 from "../public/images/Product/Product3.jpg";
import Product4 from "../public/images/Product/Product1.jpg";
import Product5 from "../public/images/Product/Product2.jpg";
import Product6 from "../public/images/Product/Product3.jpg";
import Product7 from "../public/images/Product/Product3.jpg";

export default function EditableProducts() {
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

  const defaultProducts = [
    {
      id: 1,
      image: Product1,
      title: "Innovation Platform",
      description: "Comprehensive platform for managing workflows",
      category: "Platform",
    },
    {
      id: 2,
      image: Product2,
      title: "Analytics Suite",
      description: "Advanced analytics tools for data-driven decisions",
      category: "Analytics",
    },
    {
      id: 3,
      image: Product3,
      title: "Collaboration Hub",
      description: "Seamless collaboration tools for modern teams",
      category: "Collaboration",
    },
    {
      id: 4,
      image: Product3,
      title: "Workflow Engine",
      description: "Automated workflow management",
      category: "Automation",
    },
    {
      id: 5,
      image: Product4,
      title: "Innovation Platform",
      description: "Comprehensive platform for managing workflows",
      category: "Platform",
    },
    {
      id: 6,
      image: Product5,
      title: "Analytics Suite",
      description: "Advanced analytics tools for data-driven decisions",
      category: "Analytics",
    },
    {
      id: 7,
      image: Product6,
      title: "Collaboration Hub",
      description: "Seamless collaboration tools for modern teams",
      category: "Collaboration",
    },
    {
      id: 8,
      image: Product7,
      title: "Workflow Engine",
      description: "Automated workflow management",
      category: "Automation",
    },
  ];

  const defaultCategories = [
    "All",
    "Platform",
    "Analytics",
    "Collaboration",
    "Automation",
  ];

  const defaultContent = {
    sectionTitle: "Products",
    sectionDescription: "Discover our suite of innovative products.",
    loadMoreButtonText: "Load More",
    products: defaultProducts,
    categories: defaultCategories,
  };

  const [content, setContent] = useState(defaultContent);
  const [tempContent, setTempContent] = useState(defaultContent);

  const x = useMotionValue(0);
  const speed = 0.5;

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
      const response = await new Promise((resolve) => {
        setTimeout(() => resolve(defaultContent), 1400);
      });
      setContent(response);
      setTempContent(response);
      setDataLoaded(true);
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
    if (isVisible && !dataLoaded && !isLoading) fetchProductsData();
  }, [isVisible, dataLoaded, isLoading]);

  const displayContent = isEditing ? tempContent : content;
  const filtered =
    selected === "All"
      ? displayContent.products
      : displayContent.products.filter((p) => p.category === selected);
  const duplicated = showAll ? filtered : [...filtered, ...filtered];

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
  }, [isHovered, x, duplicated.length, showAll, isEditing]);

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
    const newId = Math.max(...tempContent.products.map((p) => p.id)) + 1;
    setTempContent((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        {
          id: newId,
          title: "New Product",
          description: "Product description",
          category: "Platform",
          image: Product1,
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

  // ✅ FIX for continuous typing
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
          ? { ...product, category: "Platform" }
          : product
      ),
    }));
  };

  // ✅ FIX: EditableText memoized
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
      },
    []
  );

  return (
    <section
      ref={sectionRef}
      className='max-w-7xl mx-auto py-20 bg-gray-50 relative overflow-hidden'
    >
      <div className=' container mx-auto px-4'>
        <div className='flex justify-between items-center mb-8'>
          {isEditing ? (
            <EditableText
              value={tempContent.sectionTitle}
              onChange={(val) =>
                setTempContent({ ...tempContent, sectionTitle: val })
              }
              className='text-4xl font-bold'
            />
          ) : (
            <h2 className='text-4xl font-bold'>
              {displayContent.sectionTitle}
            </h2>
          )}

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
                selected === cat ? "bg-blue-600 text-white" : "bg-gray-200"
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

        {/* ✅ Horizontal scrolling product list */}
        <motion.div
          className='flex space-x-6'
          style={{ x }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {duplicated.map((product, index) => (
            <Card
              key={index}
              className='min-w-[300px] shadow-md rounded-xl overflow-hidden'
            >
              <CardContent className='p-4'>
                <div className='relative'>
                  <img
                    src={product.image}
                    alt={product.title}
                    className='w-full h-40 object-cover rounded'
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

                <div className='mt-4'>
                  {isEditing ? (
                    <EditableText
                      value={product.title}
                      onChange={(val) =>
                        updateProduct(product.id, "title", val)
                      }
                      className='text-lg font-semibold'
                    />
                  ) : (
                    <h3 className='text-lg font-semibold'>{product.title}</h3>
                  )}

                  {isEditing ? (
                    <EditableText
                      value={product.description}
                      onChange={(val) =>
                        updateProduct(product.id, "description", val)
                      }
                      multiline
                      className='text-gray-600 mt-2'
                    />
                  ) : (
                    <p className='text-gray-600 mt-2'>{product.description}</p>
                  )}
                </div>

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
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {isEditing && (
          <Button onClick={addProduct} size='sm' className='mt-6'>
            <Plus className='w-4 h-4 mr-1' /> Add Product
          </Button>
        )}
      </div>
    </section>
  );
}
