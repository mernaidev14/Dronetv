import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useState, useCallback } from "react";
import { Edit2, Save, X, Plus, Trash2, Loader2, Upload } from "lucide-react";
import blog1 from "../public/images/blog/blog1.jpg";
import blog2 from "../public/images/blog/blog2.jpg";
import blog3 from "../public/images/blog/blog3.jpg";
import { motion, AnimatePresence } from "framer-motion";

// Default blogs if no data is provided
const defaultBlogs = [
  {
    id: 1,
    title: "The Future of AI in Business",
    excerpt: "AI is transforming industries...",
    content: "Artificial Intelligence (AI) is no longer just a buzzword...",
    image: blog1,
    category: "Technology",
    date: "Aug 20, 2025",
    author: "Admin",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Innovation Trends to Watch",
    excerpt: "Staying ahead means staying innovative...",
    content: "Full content of innovation blog...",
    image: blog2,
    category: "Innovation",
    date: "Aug 18, 2025",
    author: "Admin",
    readTime: "5 min read",
  },
  {
    id: 3,
    title: "Building Resilient Tech Strategies",
    excerpt: "Resilience is the key...",
    content: "Full content of resilience blog...",
    image: blog3,
    category: "Strategy",
    date: "Aug 15, 2025",
    author: "Admin",
    readTime: "5 min read",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const cardHoverVariants = {
  rest: { y: 0 },
  hover: {
    y: -5,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

export default function Blog({
  onSelectBlog,
  blogData,
}: {
  onSelectBlog: (blog: any) => void;
  blogData?: any;
}) {
  // Process blog data from props or use default
  const processBlogData = () => {
    if (blogData && blogData.posts && blogData.posts.length > 0) {
      return blogData.posts.map((post, index) => ({
        id: post.id || index + 1,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image || [blog1, blog2, blog3][index % 3],
        category: post.category,
        date: post.date
          ? new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
        author: post.author || "Unknown",
        readTime: post.readTime || "5 min read",
      }));
    }
    return defaultBlogs;
  };

  const [blogs, setBlogs] = useState(processBlogData());
  const [isEditing, setIsEditing] = useState(false);
  const [tempBlogs, setTempBlogs] = useState(processBlogData());
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setTempBlogs(blogs);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempBlogs(blogs);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setBlogs(tempBlogs);
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleAddBlog = () => {
    const newBlog = {
      id: Date.now(),
      title: "New Blog Title",
      excerpt: "Short excerpt...",
      content: "Full blog content...",
      image: blog1,
      category: "General",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      author: "Admin",
      readTime: "5 min read",
    };
    setTempBlogs([...tempBlogs, newBlog]);
  };

  const handleDeleteBlog = (id: number) => {
    setTempBlogs((prev) => prev.filter((b) => b.id !== id));
  };

  const handleChange = useCallback((id, field, value) => {
    setTempBlogs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [field]: value } : b))
    );
  }, []);

  const handleImageUpload = (id: number, file: File) => {
    const imageUrl = URL.createObjectURL(file); // create local preview
    setTempBlogs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, image: imageUrl } : b))
    );
  };

  const EditableText = ({ value, onChange, multiline = false }) =>
    multiline ? (
      <motion.textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='w-full border border-yellow-400 rounded p-2 bg-white/20 
                   text-gray-900 dark:text-white focus:outline-none'
        whileFocus={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      />
    ) : (
      <motion.input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='w-full border border-yellow-400 rounded p-2 bg-white/20 
                   text-gray-900 dark:text-white focus:outline-none'
        whileFocus={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      />
    );

  return (
    <motion.section
      id='blog'
      className='py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-500 scroll-mt-20 relative'
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
    >
      {/* Edit Controls */}
      <motion.div
        className='absolute top-4 right-6 flex gap-2'
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {!isEditing ? (
          <Button
            onClick={handleEdit}
            className='bg-white shadow-md'
            variant='outline'
            size='sm'
          >
            <Edit2 className='w-4 h-4 mr-2' />
            Edit Blogs
          </Button>
        ) : (
          <>
            <Button
              onClick={handleSave}
              size='sm'
              className='bg-green-600 text-white'
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
              className='bg-white'
              disabled={isSaving}
            >
              <X className='w-4 h-4 mr-2' />
              Cancel
            </Button>
            <Button
              onClick={handleAddBlog}
              size='sm'
              className='bg-blue-600 text-white'
            >
              <Plus className='w-4 h-4 mr-2' /> Add Blog
            </Button>
          </>
        )}
      </motion.div>

      <div className='max-w-7xl mx-auto px-6'>
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
            {blogData?.header?.title || "Latest Blogs"}
          </h2>
          <p className='text-gray-600 dark:text-gray-300'>
            {blogData?.header?.desc || "Stay updated with our latest insights."}
          </p>
        </motion.div>

        <motion.div
          className='grid md:grid-cols-3 gap-8'
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, margin: "-50px" }}
        >
          <AnimatePresence>
            {(isEditing ? tempBlogs : blogs).map((b) => (
              <motion.div
                key={b.id}
                variants={itemVariants}
                layout
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  variants={cardHoverVariants}
                  initial='rest'
                  whileHover='hover'
                >
                  <Card className='shadow-lg dark:bg-gray-700 transition-all duration-300 overflow-hidden'>
                    <div className='relative'>
                      <motion.img
                        src={b.image}
                        className='w-full h-48 object-cover'
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />
                      {isEditing && (
                        <motion.div
                          className='absolute bottom-2 right-2'
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <label className='flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 p-2 rounded shadow cursor-pointer'>
                            <Upload className='w-4 h-4 text-gray-600 dark:text-gray-200' />
                            <span className='text-sm text-gray-700 dark:text-gray-200'>
                              Change
                            </span>
                            <input
                              type='file'
                              accept='image/*'
                              className='hidden'
                              onChange={(e) =>
                                e.target.files &&
                                handleImageUpload(b.id, e.target.files[0])
                              }
                            />
                          </label>
                        </motion.div>
                      )}
                    </div>
                    <CardContent className='p-6 space-y-3'>
                      {isEditing ? (
                        <>
                          <div className='flex justify-between'>
                            <EditableText
                              value={b.date}
                              onChange={(val) =>
                                handleChange(b.id, "date", val)
                              }
                            />
                            <EditableText
                              value={b.readTime}
                              onChange={(val) =>
                                handleChange(b.id, "readTime", val)
                              }
                            />
                          </div>
                          <EditableText
                            value={b.category}
                            onChange={(val) =>
                              handleChange(b.id, "category", val)
                            }
                          />
                          <EditableText
                            value={b.author}
                            onChange={(val) =>
                              handleChange(b.id, "author", val)
                            }
                          />
                          <EditableText
                            value={b.title}
                            onChange={(val) => handleChange(b.id, "title", val)}
                          />
                          <EditableText
                            value={b.excerpt}
                            onChange={(val) =>
                              handleChange(b.id, "excerpt", val)
                            }
                          />
                          <EditableText
                            value={b.content}
                            multiline
                            onChange={(val) =>
                              handleChange(b.id, "content", val)
                            }
                          />

                          {/* Delete Button */}
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              onClick={() => handleDeleteBlog(b.id)}
                              variant='outline'
                              size='sm'
                              className='bg-red-600 text-white mt-2'
                            >
                              <Trash2 className='w-4 h-4 mr-2' />
                              Delete
                            </Button>
                          </motion.div>
                        </>
                      ) : (
                        <>
                          <div className='flex justify-between items-center text-sm text-gray-500 dark:text-gray-400'>
                            <span>{b.date}</span>
                            <motion.span
                              className='bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300'
                              whileHover={{ scale: 1.05 }}
                            >
                              {b.category}
                            </motion.span>
                          </div>
                          <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
                            {b.title}
                          </h3>
                          <p className='text-gray-600 dark:text-gray-300'>
                            {b.excerpt}
                          </p>
                          <div className='flex justify-between items-center mt-4'>
                            <div className='text-sm text-gray-500 dark:text-gray-400'>
                              <span>{b.author}</span>
                              <span className='mx-2'>•</span>
                              <span>{b.readTime}</span>
                            </div>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                variant='ghost'
                                className='text-red-500 dark:text-red-400 hover:text-red-600'
                                onClick={() => onSelectBlog(b)}
                              >
                                Read More →
                              </Button>
                            </motion.div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.section>
  );
}
