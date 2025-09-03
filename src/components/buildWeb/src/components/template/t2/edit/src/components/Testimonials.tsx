import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import { Button } from "./ui/button";

export default function Testimonials({testimonialsData, onStateChange}) {
  const [isEditing, setIsEditing] = useState(false);
  
  // Merged all state into a single object
  const [testimonialsSection, setTestimonialsSection] = useState(testimonialsData);

  // Add this useEffect to notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(testimonialsSection);
    }
  }, [testimonialsSection, onStateChange]);

  // Handlers for testimonials
  const updateTestimonial = (idx, field, value) => {
    setTestimonialsSection(prev => ({
      ...prev,
      testimonials: prev.testimonials.map((t, i) => 
        i === idx ? { ...t, [field]: value } : t
      )
    }));
  };
  
  const removeTestimonial = (idx) => {
    setTestimonialsSection(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== idx)
    }));
  };
  
  const addTestimonial = () => {
    setTestimonialsSection(prev => ({
      ...prev,
      testimonials: [
        ...prev.testimonials,
        {
          name: "New Client",
          role: "Role, Company",
          image: "",
          quote: "New testimonial...",
          rating: 5,
        },
      ]
    }));
  };

  // Handlers for stats
  const updateStat = (idx, field, value) => {
    setTestimonialsSection(prev => ({
      ...prev,
      stats: prev.stats.map((s, i) => 
        i === idx ? { ...s, [field]: value } : s
      )
    }));
  };
  
  const removeStat = (idx) => {
    setTestimonialsSection(prev => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== idx)
    }));
  };
  
  const addStat = () => {
    setTestimonialsSection(prev => ({
      ...prev,
      stats: [...prev.stats, { value: "New", label: "New Stat" }]
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.section
      className="py-20 bg-background theme-transition"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
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
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {isEditing ? (
            <>
              <input
                value={testimonialsSection.headline.title}
                onChange={e => setTestimonialsSection(prev => ({
                  ...prev,
                  headline: { ...prev.headline, title: e.target.value }
                }))}
                className="text-3xl md:text-4xl text-foreground mb-4 w-full text-center bg-transparent border-b font-bold"
              />
              <textarea
                value={testimonialsSection.headline.description}
                onChange={e => setTestimonialsSection(prev => ({
                  ...prev,
                  headline: { ...prev.headline, description: e.target.value }
                }))}
                className="text-lg text-muted-foreground w-full text-center bg-transparent border-b"
                rows={2}
              />
            </>
          ) : (
            <>
              <h2 className="text-3xl md:text-4xl text-foreground mb-4">
               {testimonialsSection.headline.title}
              </h2>
              <p className="text-lg text-muted-foreground">
                {testimonialsSection.headline.description}
              </p>
            </>
          ) }
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          transition={{duration: 0.8}}
          animate={{opacity:[0,1],y:[50,0]}}
          viewport={{ once: true }}
        >
          {testimonialsSection.testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-card border-border hover:shadow-xl transition-all duration-300 hover:border-primary/30">
                <CardContent className="p-8">
                  {/* Rating */}
                  <div className="flex space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: index * 0.1 + i * 0.05,
                          duration: 0.4,
                          type: "spring",
                        }}
                        whileHover={{ scale: 1.2 }}
                      >
                        <Star className="h-5 w-5 fill-primary text-primary" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Quote */}
                  {isEditing ? (
                    <textarea
                      value={testimonial.quote}
                      onChange={(e) =>
                        updateTestimonial(index, "quote", e.target.value)
                      }
                      className="text-card-foreground leading-relaxed w-full border-b mb-6 bg-transparent"
                    />
                  ) : (
                    <blockquote className="text-card-foreground mb-6 leading-relaxed">
                      <span className="text-card-foreground leading-relaxed">
                        {testimonial.quote}
                      </span>
                    </blockquote>
                  )}

                  {/* Author */}
                  <div className="flex items-center space-x-4">
                    <motion.div
                      className="w-12 h-12 rounded-full overflow-hidden"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* {isEditing ? (
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                updateTestimonial(
                                  index,
                                  "image",
                                  reader.result as string
                                );
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageWithFallback
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      )} */}
                    </motion.div>
                    <div>
                      {isEditing ? (
                        <>
                          <input
                            value={testimonial.name}
                            onChange={(e) =>
                              updateTestimonial(index, "name", e.target.value)
                            }
                            className="font-medium text-card-foreground w-full border-b bg-transparent"
                          />
                          <input
                            value={testimonial.role}
                            onChange={(e) =>
                              updateTestimonial(index, "role", e.target.value)
                            }
                            className="text-sm text-muted-foreground w-full border-b bg-transparent"
                          />
                          <input
                            type="number"
                            min={1}
                            max={5}
                            value={testimonial.rating}
                            onChange={(e) =>
                              updateTestimonial(
                                index,
                                "rating",
                                Number(e.target.value)
                              )
                            }
                            className="w-16 mt-2 border rounded px-2 py-1 text-sm"
                            placeholder="Rating"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            className="mt-2 hover:scale-105 cursor-pointer "
                            onClick={() => removeTestimonial(index)}
                          >
                            Remove
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="font-medium text-card-foreground">
                            {testimonial.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {testimonial.role}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {isEditing && (
            <motion.div
            whileTap={{scale:0.9}}
            whileHover={{scale:1.1}}
            className="flex items-center justify-center">
              <Button onClick={addTestimonial} className="text-green-600">
                + Add Testimonial
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Stats section */}
        <motion.div
          className="mt-16 pt-16 border-t border-border"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {testimonialsSection.stats.map((stat, index) => (
              <motion.div
                key={index}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                whileHover={{ y: -3 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  {isEditing ? (
                    <input
                      value={stat.value}
                      onChange={(e) =>
                        updateStat(index, "value", e.target.value)
                      }
                      className="text-3xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors w-full text-center border-b bg-transparent"
                    />
                  ) : (
                    <div className="text-3xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {stat.value}
                    </div>
                  )}
                </motion.div>
                {isEditing ? (
                  <>
                    <input
                      value={stat.label}
                      onChange={(e) =>
                        updateStat(index, "label", e.target.value)
                      }
                      className="text-muted-foreground w-full text-center border-b bg-transparent"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="mt-2 cursor-pointer hover:scale-105"
                      onClick={() => removeStat(index)}
                    >
                      Remove
                    </Button>
                  </>
                ) : (
                  <div className="text-muted-foreground">{stat.label}</div>
                )}
                <motion.div
                  className="w-8 h-1 bg-primary/30 group-hover:bg-primary transition-colors mt-2 mx-auto rounded-full"
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
            {isEditing && (
              <motion.div
              whileTap={{scale:0.9}}
              whileHover={{scale:1.1}}
              className="flex items-center justify-center">
                <Button onClick={addStat} className="text-green-600 cursor-pointer">
                  + Add Stat
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>

        
      </div>
    </motion.section>
  );
}
