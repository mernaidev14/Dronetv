import { motion } from "motion/react";
import { useState } from "react";
import { Edit2, Save, Plus, X } from "lucide-react";

export default function EditableHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Editable content state
  const [content, setContent] = useState({
    logo: "Innovative Labs",
    logoColor: "text-red-500",
    logoDarkColor: "dark:text-yellow-400",
    signUpText: "Sign Up",
    signUpBg: "bg-yellow-400",
    signUpDarkBg: "dark:bg-yellow-500",
    signUpTextColor: "text-red-500",
    signUpDarkTextColor: "dark:text-gray-900",
    navItems: [
      { id: 1, text: "Home", href: "#home" },
      { id: 2, text: "About", href: "#about" },
      { id: 3, text: "Product", href: "#product" },
      { id: 4, text: "Services", href: "#services" },
      { id: 5, text: "Testimonials", href: "#testimonials" },
      { id: 6, text: "Blog", href: "#blog" },
    ],
  });

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const stopEditing = () => {
    setIsEditing(false);
    console.log("Header content saved:", content);
  };

  const updateContent = (field, value) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  const updateNavItem = (id, field, value) => {
    setContent((prev) => ({
      ...prev,
      navItems: prev.navItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addNavItem = () => {
    const newId = Math.max(...content.navItems.map((item) => item.id)) + 1;
    setContent((prev) => ({
      ...prev,
      navItems: [
        ...prev.navItems,
        { id: newId, text: "New Item", href: "#new" },
      ],
    }));
  };

  const removeNavItem = (id) => {
    if (content.navItems.length > 1) {
      setContent((prev) => ({
        ...prev,
        navItems: prev.navItems.filter((item) => item.id !== id),
      }));
    }
  };

  // Inline styles for maximum specificity and reliability
  const headerStyles = {
    position: "fixed",
    top: "56px", // Account for existing 56px navbar
    left: "0",
    right: "0",
    width: "100%",
    zIndex: 900, // Lower than existing navbar
    backgroundColor: "white",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    borderBottom: "1px solid #e5e7eb",
    transition: "all 0.5s ease",
    minHeight: isEditing ? "120px" : "80px", // Dynamic height based on editing state
  };

  const mobileButtonStyles = {
    position: "relative",
    zIndex: 1001,
    display: "block",
    visibility: "visible",
    opacity: "1",
    pointerEvents: "auto",
    padding: "0.5rem",
    borderRadius: "0.375rem",
    color: "#374151",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const mobileMenuStyles = {
    position: "fixed",
    top: isEditing ? "176px" : "136px", // Dynamic top position: 56px + (120px or 80px)
    left: "0",
    right: "0",
    zIndex: 899,
    backgroundColor: "white",
    borderTop: "1px solid #e5e7eb",
    maxHeight: isMobileMenuOpen ? "384px" : "0",
    opacity: isMobileMenuOpen ? "1" : "0",
    overflow: "hidden",
    transition: "all 0.3s ease-in-out",
  };

  return (
    <>
      {/* Header */}
      <motion.header
        style={headerStyles}
        className='dark:bg-gray-900 dark:border-gray-700'
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div
            className={`flex items-center justify-between transition-all duration-500 ${
              isEditing ? "min-h-[120px] py-4" : "h-20"
            }`}
          >
            {/* Logo */}
            <motion.div
              className={`text-xl sm:text-2xl font-bold ${content.logoColor} ${content.logoDarkColor} transition-colors duration-300`}
              whileHover={{ scale: 1.05 }}
            >
              {isEditing ? (
                <input
                  type='text'
                  value={content.logo}
                  onChange={(e) => updateContent("logo", e.target.value)}
                  className='bg-transparent border-b-2 border-blue-300 outline-none text-xl sm:text-2xl font-bold'
                  autoFocus
                />
              ) : (
                content.logo
              )}
            </motion.div>

            {/* Desktop Navigation */}
            <nav
              className={`hidden md:flex items-center transition-all duration-500 ${
                isEditing ? "space-x-4 flex-wrap" : "space-x-8"
              }`}
            >
              {content.navItems.map((item) => (
                <div
                  key={item.id}
                  className={`relative group ${isEditing ? "mb-2" : ""}`}
                >
                  {isEditing ? (
                    <div className='flex flex-col space-y-1 min-w-[120px]'>
                      <input
                        type='text'
                        value={item.text}
                        onChange={(e) =>
                          updateNavItem(item.id, "text", e.target.value)
                        }
                        className='bg-white dark:bg-gray-800 border border-blue-300 rounded outline-none text-sm text-center px-2 py-1'
                      />
                      <input
                        type='text'
                        value={item.href}
                        onChange={(e) =>
                          updateNavItem(item.id, "href", e.target.value)
                        }
                        className='bg-white dark:bg-gray-800 border border-blue-300 rounded outline-none text-xs text-center text-gray-500 px-2 py-1'
                        placeholder='URL'
                      />
                      {content.navItems.length > 1 && (
                        <button
                          onClick={() => removeNavItem(item.id)}
                          className='absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-600'
                          title='Remove item'
                        >
                          <X size={10} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <a
                      href={item.href}
                      className='text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300'
                    >
                      {item.text}
                    </a>
                  )}
                </div>
              ))}

              {isEditing && (
                <button
                  onClick={addNavItem}
                  className='bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-600 mb-2'
                  title='Add navigation item'
                >
                  <Plus size={16} />
                </button>
              )}

              {/* Sign Up Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative ${isEditing ? "mb-2" : ""}`}
              >
                {isEditing ? (
                  <div className='flex flex-col space-y-2 min-w-[140px]'>
                    <input
                      type='text'
                      value={content.signUpText}
                      onChange={(e) =>
                        updateContent("signUpText", e.target.value)
                      }
                      className='bg-white dark:bg-gray-800 border-2 border-blue-300 outline-none px-3 py-1 rounded text-center text-sm font-medium'
                      placeholder='Button text'
                    />
                    <select
                      value={content.signUpBg}
                      onChange={(e) =>
                        updateContent("signUpBg", e.target.value)
                      }
                      className='bg-white dark:bg-gray-800 border border-gray-300 rounded text-xs px-2 py-1'
                    >
                      <option value='bg-yellow-400'>Yellow</option>
                      <option value='bg-blue-400'>Blue</option>
                      <option value='bg-green-400'>Green</option>
                      <option value='bg-red-400'>Red</option>
                      <option value='bg-purple-400'>Purple</option>
                    </select>
                  </div>
                ) : (
                  <a
                    href='#contact'
                    className={`${content.signUpBg} ${content.signUpDarkBg} ${content.signUpTextColor} ${content.signUpDarkTextColor} px-6 py-2 rounded-full font-medium hover:bg-yellow-500 dark:hover:bg-yellow-400 transition-colors duration-300 inline-block`}
                  >
                    {content.signUpText}
                  </a>
                )}
              </motion.div>

              {/* Edit Controls */}
              {!isEditing && (
                <button
                  onClick={startEditing}
                  className='text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800'
                  title='Edit Header'
                >
                  <Edit2 size={18} />
                </button>
              )}

              {isEditing && (
                <button
                  onClick={stopEditing}
                  className='bg-green-500 text-white hover:bg-green-600 transition-colors p-2 rounded-full shadow-lg border-2 border-green-300 mb-2'
                  title='Save Changes'
                >
                  <Save size={18} />
                </button>
              )}
            </nav>

            {/* Mobile menu button */}
            <div className='md:hidden flex items-center space-x-2'>
              {/* Edit Controls for Mobile */}
              {!isEditing && (
                <button
                  onClick={startEditing}
                  className='text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800'
                  title='Edit Header'
                >
                  <Edit2 size={18} />
                </button>
              )}

              {isEditing && (
                <button
                  onClick={stopEditing}
                  className='bg-green-500 text-white hover:bg-green-600 transition-colors p-2 rounded-full shadow-lg border-2 border-green-300'
                  title='Save Changes'
                >
                  <Save size={18} />
                </button>
              )}

              <button
                onClick={toggleMobileMenu}
                style={mobileButtonStyles}
                className='hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'
                aria-label='Toggle mobile menu'
                type='button'
              >
                <svg
                  className='h-6 w-6 transition-transform duration-200'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  style={{
                    transform: isMobileMenuOpen
                      ? "rotate(90deg)"
                      : "rotate(0deg)",
                  }}
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  ) : (
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M4 6h16M4 12h16M4 18h16'
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation Menu */}
      <div
        style={mobileMenuStyles}
        className='md:hidden dark:bg-gray-900 dark:border-gray-700'
      >
        <div className='px-4 pt-2 pb-3 space-y-1 sm:px-6'>
          {content.navItems.map((item) => (
            <div key={item.id} className='relative'>
              {isEditing ? (
                <div className='flex flex-col space-y-2 p-2 border rounded'>
                  <input
                    type='text'
                    value={item.text}
                    onChange={(e) =>
                      updateNavItem(item.id, "text", e.target.value)
                    }
                    className='bg-transparent border-b border-blue-300 outline-none text-base font-medium'
                  />
                  <input
                    type='text'
                    value={item.href}
                    onChange={(e) =>
                      updateNavItem(item.id, "href", e.target.value)
                    }
                    className='bg-transparent border-b border-blue-300 outline-none text-xs text-gray-500'
                    placeholder='URL'
                  />
                  {content.navItems.length > 1 && (
                    <button
                      onClick={() => removeNavItem(item.id)}
                      className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600'
                      title='Remove item'
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              ) : (
                <a
                  href={item.href}
                  className='block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-300'
                  onClick={closeMobileMenu}
                >
                  {item.text}
                </a>
              )}
            </div>
          ))}

          {isEditing && (
            <button
              onClick={addNavItem}
              className='w-full bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 flex items-center justify-center space-x-2'
              title='Add navigation item'
            >
              <Plus size={16} />
              <span>Add Item</span>
            </button>
          )}

          <div className='pt-2'>
            {isEditing ? (
              <div className='flex flex-col space-y-2'>
                <input
                  type='text'
                  value={content.signUpText}
                  onChange={(e) => updateContent("signUpText", e.target.value)}
                  className='bg-white dark:bg-gray-800 border-2 border-blue-300 outline-none px-4 py-2 rounded-full font-medium text-center'
                  placeholder='Button text'
                />
                <select
                  value={content.signUpBg}
                  onChange={(e) => updateContent("signUpBg", e.target.value)}
                  className='bg-white dark:bg-gray-800 border border-gray-300 rounded px-3 py-1'
                >
                  <option value='bg-yellow-400'>Yellow</option>
                  <option value='bg-blue-400'>Blue</option>
                  <option value='bg-green-400'>Green</option>
                  <option value='bg-red-400'>Red</option>
                  <option value='bg-purple-400'>Purple</option>
                </select>
              </div>
            ) : (
              <a
                href='#contact'
                className={`block w-full ${content.signUpBg} ${content.signUpDarkBg} ${content.signUpTextColor} ${content.signUpDarkTextColor} px-6 py-2 rounded-full font-medium hover:bg-yellow-500 dark:hover:bg-yellow-400 transition-colors duration-300 text-center`}
                onClick={closeMobileMenu}
              >
                {content.signUpText}
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
