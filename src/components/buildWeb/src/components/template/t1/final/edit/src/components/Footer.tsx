import React, { useState, useEffect, useRef } from "react";
import logo from "../public/images/logos/logo.svg";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Github,
  Linkedin,
  Instagram,
  ArrowRight,
  Edit2,
  Save,
  X,
  Plus,
  Trash2,
  Twitter,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { motion } from "motion/react";
import { toast } from "react-toastify";

export default function EditableFooter({ 
  content, 
  onStateChange, 
}) {
  // Initialize with data from props or use default structure
  const initialData = content;

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [footerData, setFooterData] = useState(initialData);
  const [tempData, setTempData] = useState(initialData);

  // Update state when content prop changes
  useEffect(() => {
    if (content) {
      setFooterData(content);
      setTempData(content);
    }
  }, [content]);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(footerData);
    }
  }, [footerData, onStateChange]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData(footerData);
  };

  const handleCancel = () => {
    setTempData(footerData);
    setIsEditing(false);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setFooterData(tempData);
      setIsEditing(false);
      setIsSaving(false);
      toast.success('Footer saved successfully');
    }, 500);
  };

  const updateNestedField = (path, value) => {
    setTempData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let current = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;

      return newData;
    });
  };

  const addSectionLink = (sectionId) => {
    setTempData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              links: [
                ...section.links,
                {
                  id: Date.now(),
                  text: "New Link",
                  href: "#new",
                },
              ],
            }
          : section
      ),
    }));
  };

  const removeSectionLink = (sectionId, linkId) => {
    setTempData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              links: section.links.filter((link) => link.id !== linkId),
            }
          : section
      ),
    }));
  };

  const updateSectionLink = (sectionId, linkId, field, value) => {
    setTempData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              links: section.links.map((link) =>
                link.id === linkId ? { ...link, [field]: value } : link
              ),
            }
          : section
      ),
    }));
  };

  const addSection = () => {
    setTempData((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: Date.now(),
          title: "New Section",
          links: [{ id: 1, text: "New Link", href: "#" }],
        },
      ],
    }));
  };

  const removeSection = (sectionId) => {
    if (tempData.sections.length > 1) {
      setTempData((prev) => ({
        ...prev,
        sections: prev.sections.filter((section) => section.id !== sectionId),
      }));
    }
  };

  const updateSocialMedia = (index, field, value) => {
    setTempData((prev) => ({
      ...prev,
      socialMedia: prev.socialMedia.map((social, i) =>
        i === index ? { ...social, [field]: value } : social
      ),
    }));
  };

  const addSocialMedia = () => {
    setTempData((prev) => ({
      ...prev,
      socialMedia: [
        ...prev.socialMedia,
        {
          id: Date.now(),
          name: "New Social",
          icon: "Facebook",
          href: "#",
          hoverColor: "hover:bg-blue-600",
        },
      ],
    }));
  };

  const removeSocialMedia = (id) => {
    if (tempData.socialMedia.length > 1) {
      setTempData((prev) => ({
        ...prev,
        socialMedia: prev.socialMedia.filter((social) => social.id !== id),
      }));
    }
  };

  const updateLegalLink = (index, field, value) => {
    setTempData((prev) => ({
      ...prev,
      legalLinks: prev.legalLinks.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      ),
    }));
  };

  const addLegalLink = () => {
    setTempData((prev) => ({
      ...prev,
      legalLinks: [
        ...prev.legalLinks,
        { id: Date.now(), text: "New Link", href: "#" },
      ],
    }));
  };

  const removeLegalLink = (id) => {
    if (tempData.legalLinks.length > 1) {
      setTempData((prev) => ({
        ...prev,
        legalLinks: prev.legalLinks.filter((link) => link.id !== id),
      }));
    }
  };

  const getSocialIcon = (iconName) => {
    const icons = {
      Facebook: Facebook,
      Github: Github,
      Linkedin: Linkedin,
      Instagram: Instagram,
      Twitter: Twitter,
    };
    const IconComponent = icons[iconName] || Facebook;
    return <IconComponent className='w-4 h-4' />;
  };

  const EditableField = ({
    value,
    onChange,
    placeholder,
    multiline = false,
    className = "",
  }) => {
    if (multiline) {
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full p-2 border border-gray-600 rounded bg-gray-800 text-white text-sm resize-none ${className}`}
          rows={3}
        />
      );
    }

    return (
      <input
        type='text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full p-2 border border-gray-600 rounded bg-gray-800 text-white text-sm ${className}`}
      />
    );
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
    <>
      {/* Footer Preview/Edit */}
      <motion.footer 
        className='bg-gray-900 border-t border-gray-800 relative'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className='max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12 relative'>
          {/* Edit Toggle - positioned in top right */}
          <div className='absolute top-4 right-4 z-10'>
            {!isEditing ? (
              <Button
                onClick={handleEdit}
                className="bg-yellow-400 hover:bg-yellow-500 text-black"
                size='sm'
              >
                <Edit2 className='w-3 h-3 mr-1' />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size='sm'
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                  ) : (
                    <Save className='w-3 h-3 mr-1' />
                  )}
                  Save
                </Button>
                <Button
                  onClick={handleCancel}
                  className="bg-gray-600 hover:bg-gray-700 text-white"
                  size='sm'
                >
                  <X className='w-3 h-3 mr-1' />
                  Cancel
                </Button>
              </div>
            )}
          </div>
          
          {/* Main Footer Content */}
          <motion.div 
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-center md:text-left'
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Brand Section */}
            <motion.div 
              className='col-span-1 md:col-span-2 lg:col-span-1'
              variants={itemVariants}
            >
              <div className='flex items-center justify-center md:justify-start space-x-3 mb-4'>
                <span className='flex flex-row gap-2 text-xl font-bold text-red-500'>
                  <img
                    src={tempData.brand.logoUrl}
                    alt='Logo'
                    className='h-4 w-4 sm:h-6 sm:w-6 object-contain'
                    style={{
                      filter: isEditing ? "brightness(0.7)" : "none",
                    }}
                  />
                  {isEditing ? (
                    <EditableField
                      value={tempData.brand.name}
                      onChange={(value) =>
                        updateNestedField("brand.name", value)
                      }
                      placeholder='Brand name'
                      className='bg-gray-800 border-gray-600'
                    />
                  ) : (
                    tempData.brand.name
                  )}
                </span>
              </div>

              {isEditing ? (
                <div className='mb-4'>
                  <label className='block text-xs text-gray-400 mb-1'>
                    Logo URL:
                  </label>
                  <EditableField
                    value={tempData.brand.logoUrl}
                    onChange={(value) =>
                      updateNestedField("brand.logoUrl", value)
                    }
                    placeholder='Logo URL'
                    className='mb-2'
                  />
                  <label className='block text-xs text-gray-400 mb-1'>
                    Description:
                  </label>
                  <EditableField
                    value={tempData.brand.description}
                    onChange={(value) =>
                      updateNestedField("brand.description", value)
                    }
                    placeholder='Brand description'
                    multiline={true}
                  />
                </div>
              ) : (
                <p className='text-gray-300 text-sm leading-relaxed mb-6'>
                  {tempData.brand.description}
                </p>
              )}

              {/* Newsletter Signup */}
              <div className='space-y-3'>
                {isEditing ? (
                  <div>
                    <label className='block text-xs text-gray-400 mb-1'>
                      Newsletter Title:
                    </label>
                    <EditableField
                      value={tempData.newsletter.title}
                      onChange={(value) =>
                        updateNestedField("newsletter.title", value)
                      }
                      placeholder='Newsletter title'
                      className='mb-2'
                    />
                  </div>
                ) : (
                  <h4 className='font-medium text-white text-sm'>
                    {tempData.newsletter.title}
                  </h4>
                )}

                <div className='flex flex-col sm:flex-row gap-2 justify-center md:justify-start'>
                  <Input
                    type='email'
                    placeholder={tempData.newsletter.placeholder}
                    className='h-10 text-sm flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500'
                    disabled={isEditing}
                  />
                  <Button
                    size='sm'
                    className='bg-yellow-400 hover:bg-yellow-500 h-10 px-4 whitespace-nowrap text-black'
                  >
                    Subscribe
                    <ArrowRight className='w-4 h-4 ml-2' />
                  </Button>
                </div>
                {isEditing && (
                  <div className='mt-1'>
                    <label className='block text-xs text-gray-400 mb-1'>
                      Email Placeholder:
                    </label>
                    <EditableField
                      value={tempData.newsletter.placeholder}
                      onChange={(value) =>
                        updateNestedField("newsletter.placeholder", value)
                      }
                      placeholder='Email placeholder text'
                      className='text-xs'
                    />
                  </div>
                )}
              </div>
            </motion.div>

            {/* Dynamic Sections */}
            {tempData.sections.map((section, sectionIndex) => (
              <motion.div 
                key={section.id} 
                className='col-span-1'
                variants={itemVariants}
              >
                <div className='flex items-center justify-center md:justify-start mb-4'>
                  {isEditing ? (
                    <div className="flex items-center w-full">
                      <EditableField
                        value={section.title}
                        onChange={(value) => {
                          const newSections = [...tempData.sections];
                          newSections[sectionIndex] = {
                            ...newSections[sectionIndex],
                            title: value,
                          };
                          setTempData((prev) => ({
                            ...prev,
                            sections: newSections,
                          }));
                        }}
                        placeholder='Section title'
                        className='font-semibold text-white flex-1'
                      />
                      {tempData.sections.length > 1 && (
                        <Button
                          onClick={() => removeSection(section.id)}
                          size="sm"
                          variant="destructive"
                          className="ml-2"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    <h4 className='font-semibold text-white'>
                      {section.title}
                    </h4>
                  )}
                </div>

                <ul className='space-y-3 text-sm'>
                  {section.links.map((link) => (
                    <li key={link.id} className='flex items-center gap-2'>
                      {isEditing ? (
                        <div className='flex-1 space-y-1'>
                          <EditableField
                            value={link.text}
                            onChange={(value) =>
                              updateSectionLink(
                                section.id,
                                link.id,
                                "text",
                                value
                              )
                            }
                            placeholder='Link text'
                            className='text-xs'
                          />
                          <EditableField
                            value={link.href}
                            onChange={(value) =>
                              updateSectionLink(
                                section.id,
                                link.id,
                                "href",
                                value
                              )
                            }
                            placeholder='Link URL'
                            className='text-xs'
                          />
                        </div>
                      ) : (
                        <a
                          href={link.href}
                          className='text-gray-300 hover:text-blue-400 transition-colors duration-200 flex-1'
                        >
                          {link.text}
                        </a>
                      )}

                      {isEditing && (
                        <button
                          onClick={() => removeSectionLink(section.id, link.id)}
                          className='text-red-400 hover:text-red-300 p-1'
                        >
                          <Trash2 className='w-3 h-3' />
                        </button>
                      )}
                    </li>
                  ))}

                  {isEditing && (
                    <li>
                      <button
                        onClick={() => addSectionLink(section.id)}
                        className='text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm'
                      >
                        <Plus className='w-3 h-3' />
                        Add Link
                      </button>
                    </li>
                  )}
                </ul>
              </motion.div>
            ))}

            {/* Add Section Button */}
            {isEditing && (
              <motion.div 
                className="col-span-1 flex items-center justify-center"
                variants={itemVariants}
              >
                <Button
                  onClick={addSection}
                  size="sm"
                  variant="outline"
                  className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Section
                </Button>
              </motion.div>
            )}

            {/* Contact & Social Media */}
            <motion.div 
              className='col-span-1'
              variants={itemVariants}
            >
              <h4 className='font-semibold text-white mb-4'>Get in Touch</h4>

              {/* Contact Info */}
              <div className='space-y-3 mb-6 text-sm'>
                <div className='flex items-start justify-center md:justify-start space-x-3 text-gray-300'>
                  <Mail className='w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0' />
                  {isEditing ? (
                    <EditableField
                      value={tempData.contact.email}
                      onChange={(value) =>
                        updateNestedField("contact.email", value)
                      }
                      placeholder='Email address'
                      className='flex-1 text-xs'
                    />
                  ) : (
                    <span>{tempData.contact.email}</span>
                  )}
                </div>

                <div className='flex items-start justify-center md:justify-start space-x-3 text-gray-300'>
                  <Phone className='w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0' />
                  {isEditing ? (
                    <EditableField
                      value={tempData.contact.phone}
                      onChange={(value) =>
                        updateNestedField("contact.phone", value)
                      }
                      placeholder='Phone number'
                      className='flex-1 text-xs'
                    />
                  ) : (
                    <span>{tempData.contact.phone}</span>
                  )}
                </div>

                <div className='flex items-start justify-center md:justify-start space-x-3 text-gray-300'>
                  <MapPin className='w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0' />
                  {isEditing ? (
                    <EditableField
                      value={tempData.contact.address}
                      onChange={(value) =>
                        updateNestedField("contact.address", value)
                      }
                      placeholder='Address'
                      className='flex-1 text-xs'
                    />
                  ) : (
                    <span>{tempData.contact.address}</span>
                  )}
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h5 className='font-medium text-white mb-3 text-sm'>
                  Follow Us
                </h5>
                <div className='flex justify-center md:justify-start space-x-3 flex-wrap gap-2'>
                  {tempData.socialMedia.map((social, index) => (
                    <div key={social.id} className='flex flex-col gap-1 items-center'>
                      <a
                        href={social.href}
                        className={`w-9 h-9 bg-gray-800 ${social.hoverColor} rounded-lg flex items-center justify-center transition-all duration-200 text-gray-300 hover:text-white hover:scale-105`}
                        aria-label={social.name}
                      >
                        {getSocialIcon(social.icon)}
                      </a>
                      {isEditing && (
                        <div className="flex flex-col items-center">
                          <EditableField
                            value={social.name}
                            onChange={(value) => updateSocialMedia(index, "name", value)}
                            placeholder='Name'
                            className='text-xs w-20 text-center'
                          />
                          <EditableField
                            value={social.href}
                            onChange={(value) => updateSocialMedia(index, "href", value)}
                            placeholder='URL'
                            className='text-xs w-20 text-center'
                          />
                          <Button
                            onClick={() => removeSocialMedia(social.id)}
                            size="sm"
                            variant="destructive"
                            className="mt-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <Button
                      onClick={addSocialMedia}
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white h-9 w-9"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom Copyright Section */}
          <motion.div 
            className='mt-8 pt-6 border-t border-gray-800'
            variants={itemVariants}
          >
            <div className='flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 text-center md:text-left'>
              <div className='text-sm text-gray-400'>
                {isEditing ? (
                  <EditableField
                    value={tempData.copyright}
                    onChange={(value) => updateNestedField("copyright", value)}
                    placeholder='Copyright text'
                  />
                ) : (
                  tempData.copyright
                )}
              </div>

              {/* Legal Links */}
              <div className='flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm'>
                {tempData.legalLinks.map((link, index) => (
                  <div key={link.id} className='flex items-center gap-1'>
                    {isEditing ? (
                      <div className='flex flex-col gap-1'>
                        <EditableField
                          value={link.text}
                          onChange={(value) => updateLegalLink(index, "text", value)}
                          placeholder='Link text'
                          className='text-xs w-24'
                        />
                        <EditableField
                          value={link.href}
                          onChange={(value) => updateLegalLink(index, "href", value)}
                          placeholder='URL'
                          className='text-xs w-24'
                        />
                        <Button
                          onClick={() => removeLegalLink(link.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <a
                        href={link.href}
                        className='text-gray-400 hover:text-gray-200 transition-colors'
                      >
                        {link.text}
                      </a>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <Button
                    onClick={addLegalLink}
                    size="sm"
                    variant="outline"
                    className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Link
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.footer>

      {/* Edit Instructions Panel */}
      {isEditing && (
        <div className='bg-gray-100 p-4'>
          <div className='max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg'>
            <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
              <Edit2 className='w-5 h-5' />
              Footer Editor
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <h4 className='font-medium mb-2 text-gray-700'>
                  Quick Edit Tips
                </h4>
                <ul className='text-sm text-gray-600 space-y-1'>
                  <li>• Click any text field to edit content directly</li>
                  <li>• Use + Add Link to add new navigation items</li>
                  <li>• Update social media URLs in the social icons section</li>
                  <li>• Modify contact information inline</li>
                  <li>• All changes are saved when you click the Save button</li>
                </ul>
              </div>

              <div>
                <h4 className='font-medium mb-2 text-gray-700'>
                  Export Component
                </h4>
                <p className='text-sm text-gray-600 mb-2'>
                  Your changes are live! Copy the component structure to
                  integrate into your React project.
                </p>
                <div className='text-xs bg-gray-100 p-2 rounded border'>
                  <strong>Current Config:</strong>
                  <br />
                  Brand: {tempData.brand.name}
                  <br />
                  Sections: {tempData.sections.length}
                  <br />
                  Social Links: {tempData.socialMedia.length}
                  <br />
                  Legal Links: {tempData.legalLinks.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}