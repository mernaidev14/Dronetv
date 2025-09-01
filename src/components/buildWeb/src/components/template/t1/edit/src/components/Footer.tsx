import React, { useState } from "react";
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
} from "lucide-react";

const Button = ({
  children,
  className = "",
  size = "default",
  onClick,
  ...props
}) => {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

export default function EditableFooter() {
  const [isEditing, setIsEditing] = useState(false);
  const [footerData, setFooterData] = useState({
    brand: {
      name: "Innovative Labs",
      description:
        "Innovative solutions for modern businesses. Transform your operations with our expert guidance and cutting-edge technology.",
      logoUrl:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjRUYzNDQ2Ii8+Cjwvc3ZnPgo=",
    },
    newsletter: {
      title: "Stay Updated",
      placeholder: "Enter your email",
    },
    contact: {
      email: "hello@innovativelabs.com",
      phone: "+1 (555) 123-4567",
      address: "San Francisco, CA 94105",
    },
    sections: [
      {
        id: 1,
        title: "Company",
        links: [
          { id: 1, text: "About Us", href: "#about" },
          { id: 2, text: "Our Team", href: "#team" },
          { id: 3, text: "Careers", href: "#careers" },
          { id: 4, text: "News & Press", href: "#news" },
        ],
      },
      {
        id: 2,
        title: "Services",
        links: [
          { id: 1, text: "Consulting", href: "#consulting" },
          { id: 2, text: "Development", href: "#development" },
          { id: 3, text: "Support & Maintenance", href: "#support" },
          { id: 4, text: "Training", href: "#training" },
        ],
      },
    ],
    socialMedia: [
      {
        id: 1,
        name: "Facebook",
        icon: "Facebook",
        href: "#",
        hoverColor: "hover:bg-blue-600",
      },
      {
        id: 2,
        name: "GitHub",
        icon: "Github",
        href: "#",
        hoverColor: "hover:bg-gray-700",
      },
      {
        id: 3,
        name: "LinkedIn",
        icon: "Linkedin",
        href: "#",
        hoverColor: "hover:bg-blue-600",
      },
      {
        id: 4,
        name: "Instagram",
        icon: "Instagram",
        href: "#",
        hoverColor: "hover:bg-pink-600",
      },
    ],
    legalLinks: [
      { id: 1, text: "Privacy Policy", href: "#privacy" },
      { id: 2, text: "Terms of Service", href: "#terms" },
      { id: 3, text: "Status", href: "#status" },
      { id: 4, text: "Sitemap", href: "#sitemap" },
    ],
    copyright: "© 2024 Innovative Labs. All rights reserved.",
  });

  const getSocialIcon = (iconName) => {
    const icons = {
      Facebook: Facebook,
      Github: Github,
      Linkedin: Linkedin,
      Instagram: Instagram,
    };
    const IconComponent = icons[iconName] || Facebook;
    return <IconComponent className='w-4 h-4' />;
  };

  const updateNestedField = (path, value) => {
    setFooterData((prev) => {
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
    setFooterData((prev) => ({
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
    setFooterData((prev) => ({
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
    setFooterData((prev) => ({
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

  return (
    <>
      {/* Footer Preview/Edit */}
      <footer className='bg-gray-900 border-t border-gray-800 relative'>
        <div className='max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12 relative'>
          {/* Edit Toggle - positioned in top right */}
          <div className='absolute top-4 right-4 z-10'>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className={`${
                isEditing
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-yellow-400 hover:bg-yellow-400"
              } text-xs`}
              size='sm'
            >
              {isEditing ? (
                <>
                  <Save className='w-3 h-3 mr-1' />
                  Save
                </>
              ) : (
                <>
                  <Edit2 className='w-3 h-3 mr-1' />
                  Edit
                </>
              )}
            </Button>
          </div>
          {/* Main Footer Content */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-center md:text-left'>
            {/* Brand Section */}
            <div className='col-span-1 md:col-span-2 lg:col-span-1'>
              <div className='flex items-center justify-center md:justify-start space-x-3 mb-4'>
                <span className='flex flex-row gap-2 text-xl font-bold text-red-500'>
                  <img
                    src={footerData.brand.logoUrl}
                    alt='Logo'
                    className='h-6 w-6 sm:h-10 sm:w-10 object-contain'
                    style={{
                      filter: isEditing ? "brightness(0.7)" : "none",
                    }}
                  />
                  {isEditing ? (
                    <EditableField
                      value={footerData.brand.name}
                      onChange={(value) =>
                        updateNestedField("brand.name", value)
                      }
                      placeholder='Brand name'
                      className='bg-gray-800 border-gray-600'
                    />
                  ) : (
                    footerData.brand.name
                  )}
                </span>
              </div>

              {isEditing ? (
                <div className='mb-4'>
                  <label className='block text-xs text-gray-400 mb-1'>
                    Logo URL:
                  </label>
                  <EditableField
                    value={footerData.brand.logoUrl}
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
                    value={footerData.brand.description}
                    onChange={(value) =>
                      updateNestedField("brand.description", value)
                    }
                    placeholder='Brand description'
                    multiline={true}
                  />
                </div>
              ) : (
                <p className='text-gray-300 text-sm leading-relaxed mb-6'>
                  {footerData.brand.description}
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
                      value={footerData.newsletter.title}
                      onChange={(value) =>
                        updateNestedField("newsletter.title", value)
                      }
                      placeholder='Newsletter title'
                      className='mb-2'
                    />
                  </div>
                ) : (
                  <h4 className='font-medium text-white text-sm'>
                    {footerData.newsletter.title}
                  </h4>
                )}

                <div className='flex flex-col sm:flex-row gap-2 justify-center md:justify-start'>
                  <Input
                    type='email'
                    placeholder={footerData.newsletter.placeholder}
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
                      value={footerData.newsletter.placeholder}
                      onChange={(value) =>
                        updateNestedField("newsletter.placeholder", value)
                      }
                      placeholder='Email placeholder text'
                      className='text-xs'
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Sections */}
            {footerData.sections.map((section, sectionIndex) => (
              <div key={section.id} className='col-span-1'>
                <div className='flex items-center justify-center md:justify-start mb-4'>
                  {isEditing ? (
                    <EditableField
                      value={section.title}
                      onChange={(value) => {
                        const newSections = [...footerData.sections];
                        newSections[sectionIndex] = {
                          ...newSections[sectionIndex],
                          title: value,
                        };
                        setFooterData((prev) => ({
                          ...prev,
                          sections: newSections,
                        }));
                      }}
                      placeholder='Section title'
                      className='font-semibold text-white'
                    />
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
              </div>
            ))}

            {/* Contact & Social Media */}
            <div className='col-span-1'>
              <h4 className='font-semibold text-white mb-4'>Get in Touch</h4>

              {/* Contact Info */}
              <div className='space-y-3 mb-6 text-sm'>
                <div className='flex items-start justify-center md:justify-start space-x-3 text-gray-300'>
                  <Mail className='w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0' />
                  {isEditing ? (
                    <EditableField
                      value={footerData.contact.email}
                      onChange={(value) =>
                        updateNestedField("contact.email", value)
                      }
                      placeholder='Email address'
                      className='flex-1 text-xs'
                    />
                  ) : (
                    <span>{footerData.contact.email}</span>
                  )}
                </div>

                <div className='flex items-start justify-center md:justify-start space-x-3 text-gray-300'>
                  <Phone className='w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0' />
                  {isEditing ? (
                    <EditableField
                      value={footerData.contact.phone}
                      onChange={(value) =>
                        updateNestedField("contact.phone", value)
                      }
                      placeholder='Phone number'
                      className='flex-1 text-xs'
                    />
                  ) : (
                    <span>{footerData.contact.phone}</span>
                  )}
                </div>

                <div className='flex items-start justify-center md:justify-start space-x-3 text-gray-300'>
                  <MapPin className='w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0' />
                  {isEditing ? (
                    <EditableField
                      value={footerData.contact.address}
                      onChange={(value) =>
                        updateNestedField("contact.address", value)
                      }
                      placeholder='Address'
                      className='flex-1 text-xs'
                    />
                  ) : (
                    <span>{footerData.contact.address}</span>
                  )}
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h5 className='font-medium text-white mb-3 text-sm'>
                  Follow Us
                </h5>
                <div className='flex justify-center md:justify-start space-x-3 flex-wrap gap-2'>
                  {footerData.socialMedia.map((social) => (
                    <div key={social.id} className='flex flex-col gap-1'>
                      <a
                        href={social.href}
                        className={`w-9 h-9 bg-gray-800 ${social.hoverColor} rounded-lg flex items-center justify-center transition-all duration-200 text-gray-300 hover:text-white hover:scale-105`}
                        aria-label={social.name}
                      >
                        {getSocialIcon(social.icon)}
                      </a>
                      {isEditing && (
                        <EditableField
                          value={social.href}
                          onChange={(value) => {
                            setFooterData((prev) => ({
                              ...prev,
                              socialMedia: prev.socialMedia.map((s) =>
                                s.id === social.id ? { ...s, href: value } : s
                              ),
                            }));
                          }}
                          placeholder='URL'
                          className='text-xs w-20'
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Resources Section - Mobile Only */}
          <div className='mt-8 pt-6 border-t border-gray-800 md:hidden text-center'>
            <div className='grid grid-cols-2 gap-6'>
              <div>
                <h4 className='font-semibold text-white mb-4'>Resources</h4>
                <ul className='space-y-3 text-sm'>
                  <li>
                    <a
                      href='#blog'
                      className='text-gray-300 hover:text-blue-400 transition-colors duration-200'
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href='#docs'
                      className='text-gray-300 hover:text-blue-400 transition-colors duration-200'
                    >
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href='#help'
                      className='text-gray-300 hover:text-blue-400 transition-colors duration-200'
                    >
                      Help Center
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className='font-semibold text-white mb-4'>Legal</h4>
                <ul className='space-y-3 text-sm'>
                  <li>
                    <a
                      href='#privacy'
                      className='text-gray-300 hover:text-blue-400 transition-colors duration-200'
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href='#terms'
                      className='text-gray-300 hover:text-blue-400 transition-colors duration-200'
                    >
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a
                      href='#cookies'
                      className='text-gray-300 hover:text-blue-400 transition-colors duration-200'
                    >
                      Cookie Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Section */}
          <div className='mt-8 pt-6 border-t border-gray-800'>
            <div className='flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 text-center md:text-left'>
              <div className='text-sm text-gray-400'>
                {isEditing ? (
                  <EditableField
                    value={footerData.copyright}
                    onChange={(value) => updateNestedField("copyright", value)}
                    placeholder='Copyright text'
                  />
                ) : (
                  footerData.copyright
                )}
              </div>

              {/* Legal Links */}
              <div className='flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm'>
                {footerData.legalLinks.map((link) => (
                  <div key={link.id} className='flex items-center gap-1'>
                    {isEditing ? (
                      <div className='flex flex-col gap-1'>
                        <EditableField
                          value={link.text}
                          onChange={(value) => {
                            setFooterData((prev) => ({
                              ...prev,
                              legalLinks: prev.legalLinks.map((l) =>
                                l.id === link.id ? { ...l, text: value } : l
                              ),
                            }));
                          }}
                          placeholder='Link text'
                          className='text-xs w-24'
                        />
                        <EditableField
                          value={link.href}
                          onChange={(value) => {
                            setFooterData((prev) => ({
                              ...prev,
                              legalLinks: prev.legalLinks.map((l) =>
                                l.id === link.id ? { ...l, href: value } : l
                              ),
                            }));
                          }}
                          placeholder='URL'
                          className='text-xs w-24'
                        />
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
              </div>
            </div>
          </div>
        </div>
      </footer>

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
                  <li>
                    • Update social media URLs in the social icons section
                  </li>
                  <li>• Modify contact information inline</li>
                  <li>• All changes are saved in component state</li>
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
                  Brand: {footerData.brand.name}
                  <br />
                  Sections: {footerData.sections.length}
                  <br />
                  Social Links: {footerData.socialMedia.length}
                  <br />
                  Legal Links: {footerData.legalLinks.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
