import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";

import { Button } from "./ui/button";


export default function Testimonials() {
  const [isEditing, setIsEditing] = useState(false);
  const [testimonials, setTestimonials] = useState([
    {
      name: "Sarah Johnson",
      role: "CEO, TechStart Inc.",
      image:
        "https://images.unsplash.com/photo-1613473350016-1fe047d6d360?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGV4ZWN1dGl2ZSUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NTYxODQxNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      quote:
        "Working with this company has been a game-changer for our business. Their expertise and dedication to our success is unmatched.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Founder, Innovation Labs",
      image:
        "https://images.unsplash.com/photo-1584940120505-117038d90b05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBlcnNvbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NTU1MzI2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      quote:
        "The results speak for themselves. We've seen a 300% increase in efficiency since implementing their solutions.",
      rating: 5,
    },
    {
      name: "David Rodriguez",
      role: "Director, Global Enterprises",
      image:
        "https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1hbiUyMHN1aXQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTU1ODYzOTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      quote:
        "Professional, reliable, and results-driven. They've helped us scale our operations beyond what we thought possible.",
      rating: 5,
    },
  ]);
  const [stats, setStats] = useState([
    { value: "4.9/5", label: "Average Rating" },
    { value: "500+", label: "Happy Clients" },
    { value: "1000+", label: "Projects Delivered" },
    { value: "99%", label: "Client Retention" },
  ]);

  const [headline, setHeadline] = useState({
    title: "What Our Clients Say",
    description: "Don't just take our word for it. Here's what our satisfied clients have to say about working with us.",
  });

  // Handlers for testimonials
  const updateTestimonial = (idx, field, value) => {
    setTestimonials((prev) =>
      prev.map((t, i) => (i === idx ? { ...t, [field]: value } : t))
    );
  };
  const removeTestimonial = (idx) => {
    setTestimonials((prev) => prev.filter((_, i) => i !== idx));
  };
  const addTestimonial = () => {
    setTestimonials((prev) => [
      ...prev,
      {
        name: "New Client",
        role: "Role, Company",
        image: "",
        quote: "New testimonial...",
        rating: 5,
      },
    ]);
  };

  // Handlers for stats
  const updateStat = (idx, field, value) => {
    setStats((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s))
    );
  };
  const removeStat = (idx) => {
    setStats((prev) => prev.filter((_, i) => i !== idx));
  };
  const addStat = () => {
    setStats((prev) => [...prev, { value: "New", label: "New Stat" }]);
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
                value={headline.title}
                onChange={e => setHeadline(h => ({ ...h, title: e.target.value }))}
                className="text-3xl md:text-4xl text-foreground mb-4 w-full text-center bg-transparent border-b font-bold"
              />
              <textarea
                value={headline.description}
                onChange={e => setHeadline(h => ({ ...h, description: e.target.value }))}
                className="text-lg text-muted-foreground w-full text-center bg-transparent border-b"
                rows={2}
              />
            </>
          ) : (
            <>
              <h2 className="text-3xl md:text-4xl text-foreground mb-4">
               {headline.title}
              </h2>
              <p className="text-lg text-muted-foreground">
                {headline.description}
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
          {testimonials.map((testimonial, index) => (
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
                      {isEditing ? (
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
                      )}
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
                            className="mt-2"
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
            <div className="flex items-center justify-center">
              <Button onClick={addTestimonial} className="text-green-600">
                + Add Testimonial
              </Button>
            </div>
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
            {stats.map((stat, index) => (
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
                      className="mt-2"
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
              <div className="flex items-center justify-center">
                <Button onClick={addStat} className="text-green-600">
                  + Add Stat
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Edit/Save Button */}
        <div className="flex justify-end mt-6">
          {isEditing ? (
            <Button
              onClick={() => setIsEditing(false)}
              className="bg-green-600 text-white"
            >
              Save
            </Button>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-black"
            >
              Edit
            </Button>
          )}
        </div>
      </div>
    </motion.section>
  );
}
