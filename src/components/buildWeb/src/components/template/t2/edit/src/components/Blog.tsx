import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, User, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';

export default function Blog({blogData}) {
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // Merged all state into a single object
  const [blogSection, setBlogSection] = useState(blogData);

  const displayedPosts = showAllPosts ? blogSection.posts : blogSection.posts.slice(0, 4);

  const openModal = (post: any) => {
    setSelectedPost({ ...post });
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
    document.body.style.overflow = 'auto';
  };

  const saveModalChanges = () => {
    if (!selectedPost) return;
    setBlogSection(prev => ({
      ...prev,
      posts: prev.posts.map(p => (p.id === selectedPost.id ? selectedPost : p))
    }));
    setIsModalOpen(false);
    setSelectedPost(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <section id="blog" className="py-20 bg-background theme-transition">
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
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary mb-6"
            whileHover={{ scale: 1.05 }}
          >
            {isEditing ? (
              <input
                type="text"
                value={blogSection.header.badge}
                onChange={e => setBlogSection(prev => ({
                  ...prev,
                  header: { ...prev.header, badge: e.target.value }
                }))} 
                className="font-medium bg-transparent border-b text-center"
              />
            ) : (
              <span className="font-medium">{blogSection.header.badge}</span>
            )}
          </motion.div>
          
          {isEditing ? (
            <input
              type="text"
              value={blogSection.header.title}
              onChange={e => setBlogSection(prev => ({
                ...prev,
                header: { ...prev.header, title: e.target.value }
              }))}
              className="text-3xl md:text-4xl text-foreground mb-6 w-full text-center bg-transparent border-b font-bold"
            />
          ) : (
            <h2 className="text-3xl md:text-4xl text-foreground mb-6">{blogSection.header.title}</h2>
          )}
          
          {isEditing ? (
            <textarea
              value={blogSection.header.desc}
              onChange={e => setBlogSection(prev => ({
                ...prev,
                header: { ...prev.header, desc: e.target.value }
              }))}
              className="text-lg text-muted-foreground max-w-2xl mx-auto w-full text-center bg-transparent border-b"
              rows={2}
            />
          ) : (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{blogSection.header.desc}</p>
          )}
        </motion.div>
        

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayedPosts.map((post, index) => (
            <motion.article
              key={post.id}
              className="bg-card rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {isEditing && (
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute bg-white rounded-xl px-2 w-[70%] bottom-2 left-2 text-xs"
                    onChange={e => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setBlogSection(prev => ({
                            ...prev,
                            posts: prev.posts.map((p, i) =>
                              i === index ? { ...p, image: reader.result as string } : p
                            )
                          }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    {isEditing ? (
                      <input
                        value={post.category}
                        onChange={e =>
                          setBlogSection(prev => ({
                            ...prev,
                            posts: prev.posts.map((p, i) =>
                              i === index ? { ...p, category: e.target.value } : p
                            )
                          }))
                        }
                        className="text-xs font-medium text-primary-foreground bg-transparent border-b"
                      />
                    ) : (
                      post.category
                    )}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center text-xs text-muted-foreground mb-3">
                  <Calendar className="w-3 h-3 mr-1" />
                  {isEditing ? (
                    <input
                      value={post.date}
                      onChange={e =>
                        setBlogSection(prev => ({
                          ...prev,
                          posts: prev.posts.map((p, i) =>
                            i === index ? { ...p, date: e.target.value } : p
                          )
                        }))
                      }
                      className="text-xs text-muted-foreground mr-4 bg-transparent border-b"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground mr-4">{post.date}</span>
                  )}
                  <User className="w-3 h-3 mr-1" />
                  {isEditing ? (
                    <input
                      value={post.author}
                      onChange={e =>
                        setBlogSection(prev => ({
                          ...prev,
                          posts: prev.posts.map((p, i) =>
                            i === index ? { ...p, author: e.target.value } : p
                          )
                        }))
                      }
                      className="text-xs text-muted-foreground bg-transparent border-b"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">{post.author}</span>
                  )}
                </div>

                {isEditing ? (
                  <>
                    <input
                      value={post.title}
                      onChange={e =>
                        setBlogSection(prev => ({
                          ...prev,
                          posts: prev.posts.map((p, i) =>
                            i === index ? { ...p, title: e.target.value } : p
                          )
                        }))
                      }
                      className="font-semibold text-card-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2 w-full border-b bg-transparent"
                    />
                    <textarea
                      value={post.excerpt}
                      onChange={e =>
                        setBlogSection(prev => ({
                          ...prev,
                          posts: prev.posts.map((p, i) =>
                            i === index ? { ...p, excerpt: e.target.value } : p
                          )
                        }))
                      }
                      className="text-muted-foreground text-sm mb-4 line-clamp-3 w-full border-b bg-transparent"
                    />
                  </>
                ) : (
                  <>
                    <h3 className="font-semibold text-card-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </>
                )}

                <motion.button
                  className="w-full mt-4 py-2 bg-primary/10 text-primary rounded-lg font-medium flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openModal(post)}
                >
                  Read More
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </motion.button>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="mt-2 hover:scale-105"
                    onClick={() =>
                      setBlogSection(prev => ({
                        ...prev,
                        posts: prev.posts.filter((_, i) => i !== index)
                      }))
                    }
                  >
                    Remove
                  </Button>
                )}
              </div>
            </motion.article>
          ))}
          {isEditing && (
            <motion.div
            whileTap={{scale:0.9}}
            whileHover={{scale:1.1}}
            className="flex items-center justify-center">
              <Button
                onClick={() =>
                  setBlogSection(prev => ({
                    ...prev,
                    posts: [
                      ...prev.posts,
                      {
                        id: Date.now(),
                        title: "New Blog Post",
                        excerpt: "Blog post excerpt...",
                        image: "",
                        category: "New Category",
                        date: "",
                        author: "",
                        content: "<p>Blog content...</p>",
                      },
                    ]
                  }))
                }
                className="text-green-600"
              >
                + Add Blog Post
              </Button>
            </motion.div>
          )}
        </div>
        
        {/* Show More Button */}
        <div className="flex justify-center mt-6">
          {!showAllPosts && blogSection.posts.length > 4 && (
            <Button onClick={() => setShowAllPosts(true)}>
              Show More
            </Button>
          )}
          {showAllPosts && blogSection.posts.length > 4 && (
            <Button
              onClick={() => setShowAllPosts(false)}
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
        {isModalOpen && selectedPost && (
          <motion.div
            className="fixed inset-0 backdrop-blur-xl flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="bg-card relative top-15 shadow-2xl rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative">
                <ImageWithFallback
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                    {isEditing ? (
                      <input
                        value={selectedPost.category}
                        onChange={(e) =>
                          setSelectedPost((s: any) => ({ ...s, category: e.target.value }))
                        }
                        className="text-sm font-medium text-primary-foreground bg-transparent border-b"
                      />
                    ) : (
                      <span className="text-sm font-medium text-primary-foreground">{selectedPost.category}</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Calendar className="w-4 h-4 mr-1" />
                  {isEditing ? (
                    <input
                      value={selectedPost.date}
                      onChange={(e) => setSelectedPost((s: any) => ({ ...s, date: e.target.value }))}
                      className="text-sm text-muted-foreground mr-6 bg-transparent border-b"
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground mr-6">{selectedPost.date}</span>
                  )}
                  
                  <User className="w-4 h-4 mr-1" />
                  {isEditing ? (
                    <input
                      value={selectedPost.author}
                      onChange={(e) => setSelectedPost((s: any) => ({ ...s, author: e.target.value }))}
                      className="text-sm text-muted-foreground mr-6 bg-transparent border-b"
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground mr-6">{selectedPost.author}</span>
                  )}
                </div>

                {isEditing ? (
                  <>
                    <input
                      value={selectedPost.title}
                      onChange={(e) => setSelectedPost((s: any) => ({ ...s, title: e.target.value }))}
                      className="text-2xl font-bold text-card-foreground mb-4 w-full bg-transparent border-b"
                    />

                    <textarea
                      value={selectedPost.content}
                      onChange={(e) => setSelectedPost((s: any) => ({ ...s, content: e.target.value }))}
                      className="prose prose-gray max-w-none text-card-foreground w-full h-48 mb-4 border bg-transparent p-2"
                    />

                    <div className="mb-4">
                      <label className="block text-sm mb-1">Change Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setSelectedPost((s: any) => ({ ...s, image: reader.result as string }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="text-sm"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-card-foreground mb-6">{selectedPost.title}</h2>
                    <div
                      className="prose prose-gray max-w-none text-card-foreground"
                      dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                    />
                  </>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t">
                {isEditing && (
                  <Button onClick={() => saveModalChanges()} className="bg-green-600 text-white">
                    Save Changes
                  </Button>
                )}
                <Button variant="secondary" onClick={closeModal}>
                  {isEditing ? 'Close (Discard)' : 'Close'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}