import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useState, useCallback } from "react";
import { Edit2, Save, X, Plus, Trash2, Loader2, Upload } from "lucide-react";
import blog1 from "../public/images/blog/blog1.jpg";
import blog2 from "../public/images/blog/blog2.jpg";
import blog3 from "../public/images/blog/blog3.jpg";

const initialBlogs = [
  {
    id: 1,
    title: "The Future of AI in Business",
    excerpt: "AI is transforming industries...",
    content: "Artificial Intelligence (AI) is no longer just a buzzword...",
    image: blog1,
    category: "Technology",
    date: "Aug 20, 2025",
  },
  {
    id: 2,
    title: "Innovation Trends to Watch",
    excerpt: "Staying ahead means staying innovative...",
    content: "Full content of innovation blog...",
    image: blog2,
    category: "Innovation",
    date: "Aug 18, 2025",
  },
  {
    id: 3,
    title: "Building Resilient Tech Strategies",
    excerpt: "Resilience is the key...",
    content: "Full content of resilience blog...",
    image: blog3,
    category: "Strategy",
    date: "Aug 15, 2025",
  },
];

export default function Blog({
  onSelectBlog,
}: {
  onSelectBlog: (blog: any) => void;
}) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [isEditing, setIsEditing] = useState(false);
  const [tempBlogs, setTempBlogs] = useState(initialBlogs);
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
      date: new Date().toDateString(),
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
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='w-full border border-yellow-400 rounded p-2 bg-white/20 
                   text-gray-900 dark:text-white focus:outline-none'
      />
    ) : (
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='w-full border border-yellow-400 rounded p-2 bg-white/20 
                   text-gray-900 dark:text-white focus:outline-none'
      />
    );

  return (
    <section
      id='blog'
      className='py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-500 scroll-mt-20 relative'
    >
      {/* Edit Controls */}
      <div className='absolute top-4 right-6 flex gap-2'>
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
      </div>

      <div className='max-w-7xl mx-auto px-6'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
            Latest Blogs
          </h2>
          <p className='text-gray-600 dark:text-gray-300'>
            Stay updated with our latest insights.
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          {(isEditing ? tempBlogs : blogs).map((b) => (
            <Card
              key={b.id}
              className='shadow-lg dark:bg-gray-700 transition-all duration-300'
            >
              <div className='relative'>
                <img src={b.image} className='w-full h-48 object-cover' />
                {isEditing && (
                  <div className='absolute bottom-2 right-2'>
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
                  </div>
                )}
              </div>
              <CardContent className='p-6 space-y-3'>
                {isEditing ? (
                  <>
                    <EditableText
                      value={b.date}
                      onChange={(val) => handleChange(b.id, "date", val)}
                    />
                    <EditableText
                      value={b.category}
                      onChange={(val) => handleChange(b.id, "category", val)}
                    />
                    <EditableText
                      value={b.title}
                      onChange={(val) => handleChange(b.id, "title", val)}
                    />
                    <EditableText
                      value={b.excerpt}
                      onChange={(val) => handleChange(b.id, "excerpt", val)}
                    />
                    <EditableText
                      value={b.content}
                      multiline
                      onChange={(val) => handleChange(b.id, "content", val)}
                    />

                    {/* Delete Button */}
                    <Button
                      onClick={() => handleDeleteBlog(b.id)}
                      variant='outline'
                      size='sm'
                      className='bg-red-600 text-white mt-2'
                    >
                      <Trash2 className='w-4 h-4 mr-2' />
                      Delete
                    </Button>
                  </>
                ) : (
                  <>
                    <p className='text-sm text-gray-500 dark:text-gray-400 p-2'>
                      {b.date} • {b.category}
                    </p>
                    <h3 className='text-xl font-semibold px-2 pb-2 text-gray-900 dark:text-white'>
                      {b.title}
                    </h3>
                    <p className='text-gray-600 dark:text-gray-300 p-2'>
                      {b.excerpt}
                    </p>
                    <Button
                      variant='ghost'
                      className='text-red-500 dark:text-red-400 p-2 hover:text-red-600'
                      onClick={() => onSelectBlog(b)}
                    >
                      Read More →
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
