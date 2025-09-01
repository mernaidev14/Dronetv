import { motion } from "motion/react";
import { useEffect } from "react";

export default function BlogModal({
  blog,
  onClose,
}: {
  blog: any;
  onClose: () => void;
}) {
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      className='fixed inset-0 z-[1000] flex items-center justify-center mt-12 bg-black/70 p-4'
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className='relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto my-auto m-5'
        onClick={(e) => e.stopPropagation()}
        style={{ margin: "1rem" }}
      >
        {/* Close Button - Fixed positioning */}
        <button
          className='absolute -top-0.5 -right-0.5 z-[1010]  hover:bg-gray-600 rounded-full p-2 text-white transition-colors shadow-lg flex items-center justify-center'
          onClick={onClose}
          aria-label='Close modal'
          style={{ width: "32px", height: "32px" }}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-4 w-4'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={3}
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>

        {/* Hero Image */}
        <div className='relative'>
          <img
            src={blog.image}
            className='w-full h-48 object-cover rounded-t-xl'
            alt={blog.title}
          />
          <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4'>
            <div className='flex justify-between items-center'>
              <div className='text-white'>
                <span className='text-xs bg-indigo-600 px-2 py-1 rounded-full'>
                  {blog.category}
                </span>
                <p className='text-xs mt-1 opacity-90'>
                  {blog.date} • {blog.readTime || "5 min read"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='p-6'>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
            {blog.title}
          </h1>

          <p className='text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed'>
            {blog.excerpt}
          </p>

          {/* Blog Outline if available */}
          {blog.outline && blog.outline.length > 0 && (
            <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-3'>
                In this article:
              </h3>
              <ul className='space-y-1 text-sm'>
                {blog.outline.map((item: string, index: number) => (
                  <li key={index} className='flex items-start'>
                    <span className='text-indigo-600 dark:text-indigo-400 mr-2 mt-1'>
                      •
                    </span>
                    <span className='text-gray-700 dark:text-gray-300'>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Main Content */}
          <div className='text-gray-700 dark:text-gray-300 leading-7 space-y-4 text-sm'>
            {blog.content ? (
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            ) : (
              <>
                <p>
                  Drone technology is rapidly transforming industries across
                  India, offering innovative solutions that were once considered
                  impossible. From agriculture to construction, the applications
                  of drone technology are vast and continually expanding.
                </p>

                <p>
                  In the agricultural sector, drones equipped with multispectral
                  sensors can monitor crop health, detect pest infestations, and
                  optimize irrigation. This technology enables farmers to make
                  data-driven decisions, resulting in increased yields and
                  reduced resource consumption.
                </p>

                <h3 className='text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3'>
                  The Future of Drone Technology
                </h3>

                <p>
                  As regulations evolve and technology advances, we can expect
                  to see even more innovative applications of drones in various
                  sectors. The integration of AI and machine learning with drone
                  technology will further enhance their capabilities, making
                  them indispensable tools for businesses looking to gain a
                  competitive edge.
                </p>
              </>
            )}
          </div>

          {/* Keywords if available */}
          {blog.keywords && blog.keywords.length > 0 && (
            <div className='mt-6 pt-4 border-t border-gray-200 dark:border-gray-700'>
              <h4 className='text-xs font-semibold text-gray-900 dark:text-white mb-2'>
                Keywords:
              </h4>
              <div className='flex flex-wrap gap-1'>
                {blog.keywords.map((keyword: string, index: number) => (
                  <span
                    key={index}
                    className='px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs rounded-full'
                  >
                    #{keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
