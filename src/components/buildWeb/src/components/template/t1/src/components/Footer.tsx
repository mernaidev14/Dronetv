import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Github,
  Linkedin,
  Instagram,
  ArrowRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion } from "motion/react";

import logo from "../public/images/logos/logo.svg";
export default function Footer() {
  return (
    <footer className='bg-gray-900 border-t border-gray-800'>
      <div className='max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12'>
        {/* Main Footer Content */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-center md:text-left'>
          {/* Brand Section */}
          <div className='col-span-1 md:col-span-2 lg:col-span-1'>
            <div className='flex items-center justify-center md:justify-start space-x-3 mb-4'>
              <span className='flex flex-row gap-2 text-xl font-bold text-red-500'>
                <motion.img
                  src={logo}
                  alt='Logo'
                  className='h-6 w-6 sm:h-10 sm:w-10 object-contain'
                  // Entrance animation
                  initial={{ opacity: 0, scale: 0.5, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
                  // Floating effect (infinite)
                  whileInView={{
                    y: [0, -4, 0],
                    transition: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                  // Interactive hover & tap
                  whileHover={{
                    rotate: [0, -5, 5, -5, 0],
                    scale: 1.2,
                    boxShadow: "0px 0px 15px rgba(255, 215, 0, 0.6)", // gold glow
                    transition: { duration: 0.5 },
                  }}
                  whileTap={{ scale: 0.9 }}
                />
                Innovative Labs
              </span>
            </div>
            <p className='text-gray-300 text-sm leading-relaxed mb-6'>
              Innovative solutions for modern businesses. Transform your
              operations with our expert guidance and cutting-edge technology.
            </p>

            {/* Newsletter Signup */}
            <div className='space-y-3'>
              <h4 className='font-medium text-white text-sm'>Stay Updated</h4>
              <div className='flex flex-col sm:flex-row gap-2 justify-center md:justify-start'>
                <Input
                  type='email'
                  placeholder='Enter your email'
                  className='h-10 text-sm flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500'
                />
                <Button
                  size='sm'
                  className='bg-[#ffeb3b] hover:bg-[#ffeb3b] h-10 px-4 whitespace-nowrap'
                >
                  Subscribe
                  <ArrowRight className='w-4 h-4 ml-2' />
                </Button>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div className='col-span-1'>
            <h4 className='font-semibold text-white mb-4'>Company</h4>
            <ul className='space-y-3 text-sm'>
              <li>
                <a
                  href='#about'
                  className='text-gray-300 hover:text-blue-400 transition-colors duration-200'
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href='#team'
                  className='text-gray-300 hover:text-blue-400 transition-colors duration-200'
                >
                  Our Team
                </a>
              </li>
              <li>
                <a
                  href='#careers'
                  className='text-gray-300 hover:text-blue-400 transition-colors duration-200'
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href='#news'
                  className='text-gray-300 hover:text-blue-400 transition-colors duration-200'
                >
                  News & Press
                </a>
              </li>
            </ul>
          </div>

          {/* Services Links */}
          <div className='col-span-1'>
            <h4 className='font-semibold text-white mb-4'>Services</h4>
            <ul className='space-y-3 text-sm'>
              <li>
                <a
                  href='#consulting'
                  className='text-gray-300 hover:text-blue-400 transition-colors duration-200'
                >
                  Consulting
                </a>
              </li>
              <li>
                <a
                  href='#development'
                  className='text-gray-300 hover:text-blue-400 transition-colors duration-200'
                >
                  Development
                </a>
              </li>
              <li>
                <a
                  href='#support'
                  className='text-gray-300 hover:text-blue-400 transition-colors duration-200'
                >
                  Support & Maintenance
                </a>
              </li>
              <li>
                <a
                  href='#training'
                  className='text-gray-300 hover:text-blue-400 transition-colors duration-200'
                >
                  Training
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Resources */}
          <div className='col-span-1'>
            <h4 className='font-semibold text-white mb-4'>Get in Touch</h4>

            {/* Contact Info */}
            <div className='space-y-3 mb-6 text-sm'>
              <div className='flex items-start justify-center md:justify-start space-x-3 text-gray-300'>
                <Mail className='w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0' />
                <span>hello@innovativelabs.com</span>
              </div>
              <div className='flex items-start justify-center md:justify-start space-x-3 text-gray-300'>
                <Phone className='w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0' />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className='flex items-start justify-center md:justify-start space-x-3 text-gray-300'>
                <MapPin className='w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0' />
                <span>San Francisco, CA 94105</span>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h5 className='font-medium text-white mb-3 text-sm'>Follow Us</h5>
              <div className='flex justify-center md:justify-start space-x-3'>
                <a
                  href='#'
                  className='w-9 h-9 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-200 text-gray-300 hover:text-white hover:scale-105'
                  aria-label='Facebook'
                >
                  <Facebook className='w-4 h-4' />
                </a>
                <a
                  href='#'
                  className='w-9 h-9 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-all duration-200 text-gray-300 hover:text-white hover:scale-105'
                  aria-label='GitHub'
                >
                  <Github className='w-4 h-4' />
                </a>
                <a
                  href='#'
                  className='w-9 h-9 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-200 text-gray-300 hover:text-white hover:scale-105'
                  aria-label='LinkedIn'
                >
                  <Linkedin className='w-4 h-4' />
                </a>
                <a
                  href='#'
                  className='w-9 h-9 bg-gray-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-all duration-200 text-gray-300 hover:text-white hover:scale-105'
                  aria-label='Instagram'
                >
                  <Instagram className='w-4 h-4' />
                </a>
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
              © 2024 Innovative Labs. All rights reserved.
            </div>

            {/* Desktop Legal Links */}
            <div className='hidden md:flex space-x-6 text-sm'>
              <a
                href='#privacy'
                className='text-gray-400 hover:text-gray-200 transition-colors'
              >
                Privacy Policy
              </a>
              <a
                href='#terms'
                className='text-gray-400 hover:text-gray-200 transition-colors'
              >
                Terms of Service
              </a>
              <a
                href='#status'
                className='text-gray-400 hover:text-gray-200 transition-colors'
              >
                Status
              </a>
              <a
                href='#sitemap'
                className='text-gray-400 hover:text-gray-200 transition-colors'
              >
                Sitemap
              </a>
            </div>

            {/* Mobile Legal Links */}
            <div className='flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm md:hidden'>
              <a
                href='#status'
                className='text-gray-400 hover:text-gray-200 transition-colors'
              >
                Status
              </a>
              <a
                href='#sitemap'
                className='text-gray-400 hover:text-gray-200 transition-colors'
              >
                Sitemap
              </a>
              <a
                href='#accessibility'
                className='text-gray-400 hover:text-gray-200 transition-colors'
              >
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
