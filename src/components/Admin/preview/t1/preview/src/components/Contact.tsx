import { motion } from "motion/react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function Contact({ content }) {
  // Use the content prop directly
  const contactData = content;

  return (
    <section
      id='contact'
      className='py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-500 scroll-mt-20'
    >
      <div className='max-w-6xl mx-auto px-6'>
        <div className='bg-white dark:bg-gray-700 rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-3 transition-colors duration-300'>
          {/* Left: Content + Form (2fr) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className='col-span-2 p-10 lg:p-14 text-gray-900 dark:text-white'
          >
            <h2 className='text-3xl lg:text-4xl font-bold mb-4 text-gray-900 dark:text-white transition-colors duration-300'>
              {contactData.title}
            </h2>

            <p className='mb-8 text-gray-600 dark:text-gray-300 transition-colors duration-300'>
              {contactData.description}
            </p>

            {/* Benefits List */}
            {contactData.benefits && contactData.benefits.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Benefits:</h4>
                <ul className="space-y-2">
                  {contactData.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                      <span className="text-gray-600 dark:text-gray-300 text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <form className='grid gap-6'>
              {/* Name + Email */}
              <div className='grid md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200 transition-colors duration-300'>
                    Full Name
                  </label>
                  <Input
                    placeholder='John Smith'
                    className='bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white border-gray-300 dark:border-gray-500 transition-colors duration-300'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200 transition-colors duration-300'>
                    Email address
                  </label>
                  <Input
                    type='email'
                    placeholder='me@example.com'
                    className='bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white border-gray-300 dark:border-gray-500 transition-colors duration-300'
                  />
                </div>
              </div>

              {/* Dropdown */}
              <div>
                <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200 transition-colors duration-300'>
                  Where did you hear from us?
                </label>
                <select className='w-full rounded-md border-gray-300 dark:border-gray-500 px-3 py-2 bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400 transition-colors duration-300'>
                  <option>Please choose one option:</option>
                  <option>Friends & Family</option>
                  <option>Social Media</option>
                  <option>Advertisement</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Submit */}
              <Button className='bg-yellow-400 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white px-6 py-3 rounded-md font-semibold transition-colors duration-300'>
                {contactData.ctaButton}
              </Button>
            </form>
          </motion.div>

          {/* Right: Image (1fr) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='h-full col-span-1 relative'
          >
            <img
              src={contactData.backgroundImage}
              alt='CTA Illustration'
              className='w-full h-full object-cover opacity-65 dark:opacity-50 transition-opacity duration-300'
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}