import { motion } from "motion/react";

// Custom Badge component (kept for styling)
const Badge = ({ children, className }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
  >
    {children}
  </span>
);

export default function About({ aboutData }) {
  return (
    <section
      id='about'
      className='py-20 bg-blue-50 scroll-mt-20'
    >
      <div className='max-w-7xl mx-auto px-6'>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className='bg-yellow-400 text-gray-900 mb-4'>
              About Company
            </Badge>

            <h2 className='text-3xl font-bold text-gray-900 mb-6'>
              About {aboutData.companyName}
            </h2>

            <div className='space-y-4 text-gray-700'>
              <div className='grid grid-cols-1 gap-4 text-sm'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <strong>Company:</strong> {aboutData.companyName}
                  </div>
                  <div>
                    <strong>Industry:</strong> {aboutData.industry}
                  </div>
                  <div>
                    <strong>Established:</strong> {aboutData.established}
                  </div>
                  <div>
                    <strong>Headquarters:</strong> {aboutData.headquarters}
                  </div>
                </div>
              </div>

              <p className='text-gray-600 leading-relaxed'>
                {aboutData.description1}
              </p>
              <p className='text-gray-600 leading-relaxed'>
                {aboutData.description2}
              </p>

              <div className='space-y-2'>
                <div>
                  <strong>Mission:</strong> {aboutData.mission}
                </div>
                <div>
                  <strong>Vision:</strong> {aboutData.vision}
                </div>
              </div>

              {/* Certifications */}
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Certifications</h3>
                <ul className="list-disc list-inside space-y-1">
                  {aboutData.certifications.map((cert, index) => (
                    <li key={index}>{cert}</li>
                  ))}
                </ul>
              </div>

              {/* Achievements */}
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Achievements</h3>
                <ul className="list-disc list-inside space-y-1">
                  {aboutData.achievements.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img
              src={aboutData.officeImage}
              alt='Office'
              className='rounded-2xl shadow-2xl w-full h-full object-cover'
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}