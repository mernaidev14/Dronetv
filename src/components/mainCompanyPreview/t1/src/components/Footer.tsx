import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Github,
  Linkedin,
  Instagram,
  ArrowRight,
  Twitter,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { motion } from "motion/react";
import { useState } from "react";

export default function Footer({ content }) {
  let { isSubscribed, setIsSubscribed } = useState(false);
  // Use the content prop directly
  const footerData = content || {
    brand: {
      name: "Innovative Labs",
      description: "Innovative solutions for modern businesses. Transform your operations with our expert guidance and cutting-edge technology.",
      logoUrl: ""
    },
    newsletter: {
      title: "Stay Updated",
      placeholder: "Enter your email"
    },
    contact: {
      email: "hello@innovativelabs.com",
      phone: "+1 (555) 123-4567",
      address: "San Francisco, CA 94105"
    },
    sections: [
      {
        title: "Company",
        links: [
          {
            id: 1.0,
            text: "About Us",
            href: "#about"
          },
          {
            id: 2.0,
            text: "Our Team",
            href: "#team"
          },
          {
            id: 3.0,
            text: "Careers",
            href: "#careers"
          },
          {
            id: 4.0,
            text: "News & Press",
            href: "#news"
          }
        ],
        id: 1.0
      },
      {
        title: "Services",
        links: [
          {
            id: 1.0,
            text: "Consulting",
            href: "#consulting"
          },
          {
            id: 2.0,
            text: "Development",
            href: "#development"
          },
          {
            id: 3.0,
            text: "Support & Maintenance",
            href: "#support"
          },
          {
            id: 4.0,
            text: "Training",
            href: "#training"
          }
        ],
        id: 2.0
      }
    ],
    socialMedia: [
      {
        name: "Facebook",
        icon: "Facebook",
        hoverColor: "hover:bg-blue-600",
        id: 1.0,
        href: "#"
      },
      {
        name: "GitHub",
        icon: "Github",
        hoverColor: "hover:bg-gray-700",
        id: 2.0,
        href: "#"
      },
      {
        name: "LinkedIn",
        icon: "Linkedin",
        hoverColor: "hover:bg-blue-600",
        id: 3.0,
        href: "#"
      },
      {
        name: "Instagram",
        icon: "Instagram",
        hoverColor: "hover:bg-pink-600",
        id: 4.0,
        href: "#"
      }
    ],
    legalLinks: [
      {
        id: 1.0,
        text: "Privacy Policy",
        href: "#privacy"
      },
      {
        id: 2.0,
        text: "Terms of Service",
        href: "#terms"
      },
      {
        id: 3.0,
        text: "Status",
        href: "#status"
      },
      {
        id: 4.0,
        text: "Sitemap",
        href: "#sitemap"
      }
    ],
    copyright: "© 2024 Innovative Labs. All rights reserved."
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
      className='bg-gray-900 border-t border-gray-800'
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className='max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12'>
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
                  src={footerData.brand.logoUrl}
                  alt='Logo'
                  className='h-4 w-4 sm:h-6 sm:w-6 object-contain'
                />
                {footerData.brand.name}
              </span>
            </div>

            <p className='text-gray-300 text-sm leading-relaxed mb-6'>
              {footerData.brand.description}
            </p>

            {/* Newsletter Signup */}
            <div className='space-y-3'>
              <h4 className='font-medium text-white text-sm'>
                {footerData.newsletter.title}
              </h4>

              <div className='flex flex-col sm:flex-row gap-2 justify-center md:justify-start'>
                <Input
                  type='email'
                  placeholder={footerData.newsletter.placeholder}
                  className='h-10 text-sm flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500'
                />
                <Button
                  size='sm'
                  className='bg-yellow-400 hover:bg-yellow-500 h-10 px-4 whitespace-nowrap text-black'
                >
                  Subscribe
                  <ArrowRight className='w-4 h-4 ml-2' />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Dynamic Sections */}
          {footerData.sections.map((section) => (
            <motion.div 
              key={section.id} 
              className='col-span-1'
              variants={itemVariants}
            >
              <div className='flex items-center justify-center md:justify-start mb-4'>
                <h4 className='font-semibold text-white'>
                  {section.title}
                </h4>
              </div>

              <ul className='space-y-3 text-sm'>
                {section.links.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      className='text-gray-300 hover:text-blue-400 transition-colors duration-200'
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact & Social Media */}
          <motion.div 
            className='col-span-1'
            variants={itemVariants}
          >
            <h4 className='font-semibold text-white mb-4'>Get in Touch</h4>

            {/* Contact Info */}
            <div className='space-y-3 mb-6 text-sm'>
              <div className={` flex items-start justify-center md:justify-start space-x-3 text-gray-300 ${isSubscribed ? '' : 'bg-gray-300'}`}>
                <Mail className='w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0' />
                <span>{footerData.contact.email}</span>
              </div>

              <div className={`flex items-start justify-center md:justify-start space-x-3 text-gray-300 ${isSubscribed ? '' : 'bg-gray-300'}`}>
                <Phone className='w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0' />
                <span>{footerData.contact.phone}</span>
              </div>

              <div className='flex items-start justify-center md:justify-start space-x-3 text-gray-300'>
                <MapPin className='w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0' />
                <span>{footerData.contact.address}</span>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h5 className='font-medium text-white mb-3 text-sm'>
                Follow Us
              </h5>
              <div className='flex justify-center md:justify-start space-x-3 flex-wrap gap-2'>
                {footerData.socialMedia.map((social) => (
                  <a
                    key={social.id}
                    href={social.href}
                    className={`w-9 h-9 bg-gray-800 ${social.hoverColor} rounded-lg flex items-center justify-center transition-all duration-200 text-gray-300 hover:text-white hover:scale-105`}
                    aria-label={social.name}
                  >
                    {getSocialIcon(social.icon)}
                  </a>
                ))}
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
              {footerData.copyright}
            </div>

            {/* Legal Links */}
            <div className='flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm'>
              {footerData.legalLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className='text-gray-400 hover:text-gray-200 transition-colors'
                >
                  {link.text}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}