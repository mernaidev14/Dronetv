import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

// Create an icon map to convert string names to actual components
const iconMap = {
  Facebook: Facebook,
  Twitter: Twitter,
  Linkedin: Linkedin,
  LinkedIn: Linkedin, // Added alias for LinkedIn
  Instagram: Instagram,
  Mail: Mail,
  Phone: Phone,
};
export default function Footer({onStateChange,footerData}) {
  const [isEditing, setIsEditing] = useState(false);

  // Merged all state into a single object
  const [footerContent, setFooterContent] = useState(() => {
    // Process the footer data to ensure icons are proper components
    const processedData = {...footerData};
    
    if (processedData.socialLinks) {
      processedData.socialLinks = processedData.socialLinks.map(link => ({
        ...link,
        // Use the name to determine the icon if icon is not a valid string
        icon: (typeof link.icon === 'string' && iconMap[link.icon]) ? 
              iconMap[link.icon] : 
              iconMap[link.name] || Facebook // Fallback to name or Facebook
      }));
    }
    
    return processedData;
  });
 // Update footer content when footerData changes
  useEffect(() => {
    if (footerData?.services) {
      setFooterContent(prev => ({
        ...prev,
        footerLinks: {
          ...prev.footerLinks,
          Services: footerData.services.map(service => ({
            name: service.title,
            href: "#services"
          }))
        }
      }));
    }
  }, [footerData]);

  // Add this useEffect to notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(footerContent);
    }
  }, [footerContent, onStateChange]);

  // Handlers for company info
  const updateCompanyInfo = (field, value) => {
    setFooterContent(prev => ({ 
      ...prev, 
      companyInfo: { ...prev.companyInfo, [field]: value } 
    }));
  };

  // Handlers for footer links
  const updateFooterLink = (category, index, field, value) => {
    setFooterContent(prev => ({
      ...prev,
      footerLinks: {
        ...prev.footerLinks,
        [category]: prev.footerLinks[category].map((link, i) => 
          i === index ? { ...link, [field]: value } : link
        )
      }
    }));
  };

  const addFooterLink = (category) => {
    setFooterContent(prev => ({
      ...prev,
      footerLinks: {
        ...prev.footerLinks,
        [category]: [...prev.footerLinks[category], { name: "New Link", href: "#" }]
      }
    }));
  };

  const removeFooterLink = (category, index) => {
    setFooterContent(prev => ({
      ...prev,
      footerLinks: {
        ...prev.footerLinks,
        [category]: prev.footerLinks[category].filter((_, i) => i !== index)
      }
    }));
  };

  // Handlers for social links
  const updateSocialLink = (index, field, value) => {
    setFooterContent(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const addSocialLink = () => {
    setFooterContent(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { name: "New Social", icon: Facebook, href: "#" }]
    }));
  };

  const removeSocialLink = (index) => {
    setFooterContent(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  // Handlers for newsletter
  const updateNewsletter = (field, value) => {
    setFooterContent(prev => ({ 
      ...prev, 
      newsletter: { ...prev.newsletter, [field]: value } 
    }));
  };

  // Handlers for bottom footer
  const updateBottomFooter = (field, value) => {
    setFooterContent(prev => ({ 
      ...prev, 
      bottomFooter: { ...prev.bottomFooter, [field]: value } 
    }));
  };

  const updateBottomFooterLink = (index, field, value) => {
    setFooterContent(prev => ({
      ...prev,
      bottomFooter: {
        ...prev.bottomFooter,
        links: prev.bottomFooter.links.map((link, i) => 
          i === index ? { ...link, [field]: value } : link
        )
      }
    }));
  };

  const addBottomFooterLink = () => {
    setFooterContent(prev => ({
      ...prev,
      bottomFooter: {
        ...prev.bottomFooter,
        links: [...prev.bottomFooter.links, { name: "New Link", href: "#" }]
      }
    }));
  };

  const removeBottomFooterLink = (index) => {
    setFooterContent(prev => ({
      ...prev,
      bottomFooter: {
        ...prev.bottomFooter,
        links: prev.bottomFooter.links.filter((_, i) => i !== index)
      }
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.footer 
      className="bg-black text-white theme-transition"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* Edit/Save Buttons */}
      <div className="flex justify-end mr-50">
        {isEditing ? (
          <motion.button 
            whileTap={{scale:0.9}}
            whileHover={{y:-1,scaleX:1.1}}
            onClick={() => setIsEditing(false)} 
            className="bg-green-600 cursor-pointer hover:font-semibold hover:shadow-2xl shadow-xl text-white px-4 py-2 rounded"
          >
            Save
          </motion.button>
        ) : (
          <motion.button 
            whileTap={{scale:0.9}}
            whileHover={{y:-1,scaleX:1.1}}
            onClick={() => setIsEditing(true)} 
            className="bg-yellow-500 text-black px-4 py-2 rounded cursor-pointer hover:shadow-2xl shadow-xl hover:font-semibold"
          >
            Edit
          </motion.button>
        )}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <motion.div 
          className="py-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Company info */}
            <motion.div 
              className="lg:col-span-2 space-y-6"
              variants={itemVariants}
            >
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-2"
                  whileHover={{ 
                    rotate: 360,
                    boxShadow: "0 0 20px rgba(250, 204, 21, 0.4)"
                  }}
                  transition={{ duration: 0.6 }}
                >
                  {isEditing ? (
                    <input
                      value={footerContent.companyInfo.logoText}
                      onChange={(e) => updateCompanyInfo("logoText", e.target.value)}
                      className="text-black font-bold text-lg w-4 bg-transparent border-b"
                    />
                  ) : (
                    <span className="text-black font-bold text-lg">{footerContent.companyInfo.logoText}</span>
                  )}
                </motion.div>
                {isEditing ? (
                  <input
                    value={footerContent.companyInfo.companyName}
                    onChange={(e) => updateCompanyInfo("companyName", e.target.value)}
                    className="text-xl font-bold text-white bg-transparent border-b w-full"
                  />
                ) : (
                  <span className="text-xl font-bold text-white">{footerContent.companyInfo.companyName}</span>
                )}
              </motion.div>
              
              {isEditing ? (
                <textarea
                  value={footerContent.companyInfo.description}
                  onChange={(e) => updateCompanyInfo("description", e.target.value)}
                  className="text-gray-400 max-w-md w-full bg-transparent border-b"
                  rows={3}
                />
              ) : (
                <p className="text-gray-400 max-w-md">{footerContent.companyInfo.description}</p>
              )}

              {/* Contact info */}
              <div className="space-y-3">
                <motion.div 
                  className="flex items-center space-x-3"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Mail className="h-5 w-5 text-primary" />
                  {isEditing ? (
                    <input
                      value={footerContent.companyInfo.email}
                      onChange={(e) => updateCompanyInfo("email", e.target.value)}
                      className="text-gray-400 bg-transparent border-b w-full"
                    />
                  ) : (
                    <span className="text-gray-400">{footerContent.companyInfo.email}</span>
                  )}
                </motion.div>
                <motion.div 
                  className="flex items-center space-x-3"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Phone className="h-5 w-5 text-primary" />
                  {isEditing ? (
                    <input
                      value={footerContent.companyInfo.phone}
                      onChange={(e) => updateCompanyInfo("phone", e.target.value)}
                      className="text-gray-400 bg-transparent border-b w-full"
                    />
                  ) : (
                    <span className="text-gray-400">{footerContent.companyInfo.phone}</span>
                  )}
                </motion.div>
              </div>

              {/* Social links */}
              <div className="flex space-x-4 flex-wrap">
                {footerContent.socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.div
                      key={index}
                      className="flex items-center mb-2"
                    >
                      <motion.a
                        href={social.href}
                        className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary hover:text-black transition-colors"
                        aria-label={social.name}
                        whileHover={{ 
                          scale: 1.1,
                          rotate: 360
                        }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ transitionDelay: `${index * 0.1}s` }}
                      >
                        <IconComponent className="h-5 w-5" />
                      </motion.a>
                      {isEditing && (
                        <div className="ml-2">
                          <input
                            value={social.name}
                            onChange={(e) => updateSocialLink(index, "name", e.target.value)}
                            className="text-white bg-transparent border-b w-24"
                          />
                          <input
                            value={social.href}
                            onChange={(e) => updateSocialLink(index, "href", e.target.value)}
                            className="text-white bg-transparent border-b w-24 ml-1"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            className="ml-1"
                            onClick={() => removeSocialLink(index)}
                          >
                            ×
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
                {isEditing && (
                  <Button onClick={addSocialLink} className="text-green-600 hover:scale-105 cursor-pointer mb-2">
                    + Add
                  </Button>
                )}
              </div>
            </motion.div>

            {/* Footer links */}
            {Object.entries(footerContent.footerLinks).map(([category, links], categoryIndex) => (
              <motion.div 
                key={category}
                variants={itemVariants}
              >
                {isEditing ? (
                  <input
                    value={category}
                    onChange={(e) => {
                      const newCategory = e.target.value;
                      setFooterContent(prev => {
                        const newLinks = { ...prev.footerLinks };
                        newLinks[newCategory] = newLinks[category];
                        delete newLinks[category];
                        return { ...prev, footerLinks: newLinks };
                      });
                    }}
                    className="font-medium text-white mb-4 bg-transparent border-b w-full"
                  />
                ) : (
                  <h4 className="font-medium text-white mb-4">{category}</h4>
                )}
                <ul className="space-y-3">
                  {links.map((link, linkIndex) => (
                    <motion.li 
                      key={linkIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        delay: categoryIndex * 0.1 + linkIndex * 0.05,
                        duration: 0.5 
                      }}
                      whileHover={{ x: 5 }}
                    >
                      {isEditing ? (
                        <div className="flex items-center">
                          <input
                            value={link.name}
                            onChange={(e) => updateFooterLink(category, linkIndex, "name", e.target.value)}
                            className="text-gray-400 bg-transparent border-b w-full mr-2"
                          />
                          <input
                            value={link.href}
                            onChange={(e) => updateFooterLink(category, linkIndex, "href", e.target.value)}
                            className="text-gray-400 bg-transparent border-b w-full mr-2"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeFooterLink(category, linkIndex)}
                          >
                            ×
                          </Button>
                        </div>
                      ) : (
                        <a
                          href={link.href}
                          className="text-gray-400 hover:text-primary transition-colors"
                        >
                          {link.name}
                        </a>
                      )}
                    </motion.li>
                  ))}
                  {isEditing && (
                    <motion.li
                      whileHover={{scale:1.1}}
                      whileTap={{scale:0.9}}
                    >
                      <Button onClick={() => addFooterLink(category)} className="text-green-600">
                        + Add Link
                      </Button>
                    </motion.li>
                  )}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Newsletter signup */}
        <motion.div 
          className="py-8 border-t border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div>
              {isEditing ? (
                <input
                  value={footerContent.newsletter.title}
                  onChange={(e) => updateNewsletter("title", e.target.value)}
                  className="font-medium text-white mb-2 bg-transparent border-b"
                />
              ) : (
                <h4 className="font-medium text-white mb-2">{footerContent.newsletter.title}</h4>
              )}
              {isEditing ? (
                <input
                  value={footerContent.newsletter.description}
                  onChange={(e) => updateNewsletter("description", e.target.value)}
                  className="text-gray-400 bg-transparent border-b w-full"
                />
              ) : (
                <p className="text-gray-400">{footerContent.newsletter.description}</p>
              )}
            </div>
            <motion.div 
              className="flex w-full md:w-auto max-w-md"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <motion.button 
                className="px-6 py-2 bg-primary text-black rounded-r-lg hover:bg-primary/90 transition-colors font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isEditing ? (
                  <input
                    value={footerContent.newsletter.buttonText}
                    onChange={(e) => updateNewsletter("buttonText", e.target.value)}
                    className="font-medium text-black bg-transparent border-b w-full text-center"
                  />
                ) : (
                  <span className="font-medium text-black">{footerContent.newsletter.buttonText}</span>
                )}
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom footer */}
        <motion.div 
          className="py-6 border-t border-gray-800"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {isEditing ? (
              <input
                value={footerContent.bottomFooter.copyright}
                onChange={(e) => updateBottomFooter("copyright", e.target.value)}
                className="text-gray-400 text-sm bg-transparent border-b w-full md:w-auto"
              />
            ) : (
              <p className="text-gray-400 text-sm">{footerContent.bottomFooter.copyright}</p>
            )}
            <div className="flex space-x-6 text-sm">
              {footerContent.bottomFooter.links.map((link, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                  whileHover={{ y: -2 }}
                >
                  {isEditing ? (
                    <div className="flex items-center">
                      <input
                        value={link.name}
                        onChange={(e) => updateBottomFooterLink(index, "name", e.target.value)}
                        className="text-gray-400 bg-transparent border-b w-32 mr-2"
                      />
                      <input
                        value={link.href}
                        onChange={(e) => updateBottomFooterLink(index, "href", e.target.value)}
                        className="text-gray-400 bg-transparent border-b w-32 mr-2"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeBottomFooterLink(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ) : (
                    <a 
                      href={link.href} 
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </a>
                  )}
                </motion.div>
              ))}
              {isEditing && (
                <Button onClick={addBottomFooterLink} className="text-green-600">
                  + Add
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}