import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Edit2, Save, X, Upload, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import CTA from "../public/images/CTA/CTA.jpg";

export default function EditableContact({ 
  content, 
  onStateChange, 
  userId, 
  publishedId, 
  templateSelection 
}) {
  // Initialize with data from props only
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [contactData, setContactData] = useState(content || {});
  const [tempData, setTempData] = useState(content || {});
  const [pendingImage, setPendingImage] = useState<File | null>(null);
  const fileInputRef = useRef(null);

  // Update state when content prop changes
  useEffect(() => {
    if (content) {
      setContactData(content);
      setTempData(content);
    }
  }, [content]);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(contactData);
    }
  }, [contactData, onStateChange]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData(contactData);
    setPendingImage(null);
  };

  const handleCancel = () => {
    setTempData(contactData);
    setPendingImage(null);
    setIsEditing(false);
  };

  // Save button handler - uploads image and stores S3 URL
  const handleSave = async () => {
    try {
      setIsUploading(true);

      // Create a copy of tempData to update with S3 URL
      let updatedData = { ...tempData };

      // Upload background image if there's a pending image
      if (pendingImage) {
        if (!userId || !publishedId || !templateSelection) {
          console.error('Missing required props:', { userId, publishedId, templateSelection });
          toast.error('Missing user information. Please refresh and try again.');
          return;
        }
        
        const formData = new FormData();
        formData.append('file', pendingImage);
        formData.append('sectionName', 'contact');
        formData.append('imageField', 'backgroundImage');
        formData.append('templateSelection', templateSelection);

        const uploadResponse = await fetch(`https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`, {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          // Update the background image in our local copy
          updatedData.backgroundImage = uploadData.imageUrl;
          console.log('Image uploaded to S3:', uploadData.imageUrl);
        } else {
          const errorData = await uploadResponse.json();
          console.error('Image upload failed:', errorData);
          toast.error(`Image upload failed: ${errorData.message || 'Unknown error'}`);
          return; // Don't exit edit mode
        }
      }
      
      // Clear pending image
      setPendingImage(null);
      
      // Simulate save delay
      setIsSaving(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update both states with the new content including S3 URL
      setContactData(updatedData);
      setTempData(updatedData);
      
      // Exit edit mode
      setIsEditing(false);
      toast.success('Contact section saved with S3 URLs ready for publish');

    } catch (error) {
      console.error('Error saving contact section:', error);
      toast.error('Error saving changes. Please try again.');
      // Keep in edit mode so user can retry
    } finally {
      setIsUploading(false);
      setIsSaving(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File size must be less than 5MB');
      return;
    }

    // Store the file for upload on Save
    setPendingImage(file);

    // Show immediate local preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setTempData(prev => ({
        ...prev,
        backgroundImage: e.target.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const updateField = (field, value) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateBenefit = (index, value) => {
    setTempData(prev => ({
      ...prev,
      benefits: prev.benefits ? prev.benefits.map((benefit, i) => 
        i === index ? value : benefit
      ) : [value]
    }));
  };

  const addBenefit = () => {
    setTempData(prev => ({
      ...prev,
      benefits: prev.benefits ? [...prev.benefits, "New benefit"] : ["New benefit"]
    }));
  };

  const removeBenefit = (index) => {
    if (tempData.benefits && tempData.benefits.length > 1) {
      setTempData(prev => ({
        ...prev,
        benefits: prev.benefits.filter((_, i) => i !== index)
      }));
    }
  };

  const EditableText = ({ value, onChange, multiline = false, className = "", placeholder = "" }) => {
    const baseClasses = "w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none";
    if (multiline) {
      return (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseClasses} p-2 resize-none ${className}`}
          placeholder={placeholder}
          rows={3}
        />
      );
    }
    return (
      <input
        type='text'
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={`${baseClasses} p-1 ${className}`}
        placeholder={placeholder}
      />
    );
  };

  return (
    <section
      id='contact'
      className='py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-500 scroll-mt-20 relative'
    >
      {/* Edit Controls */}
      <div className="absolute top-4 right-4 z-10">
        {!isEditing ? (
          <Button
            onClick={handleEdit}
            variant="outline"
            size="sm"
            className="bg-white hover:bg-gray-50 shadow-md"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white shadow-md"
              disabled={isSaving || isUploading}
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isUploading ? "Uploading..." : isSaving ? "Saving..." : "Save"}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              size="sm"
              className="bg-white hover:bg-gray-50 shadow-md"
              disabled={isSaving || isUploading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

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
            {isEditing ? (
              <EditableText
                value={tempData.title}
                onChange={(val) => updateField("title", val)}
                className='text-3xl lg:text-4xl font-bold mb-4'
                placeholder="Section Title"
              />
            ) : (
              <h2 className='text-3xl lg:text-4xl font-bold mb-4 text-gray-900 dark:text-white transition-colors duration-300'>
                {tempData.title || "Contact Us"}
              </h2>
            )}

            {isEditing ? (
              <EditableText
                value={tempData.description}
                onChange={(val) => updateField("description", val)}
                multiline
                className='mb-8 text-gray-600 dark:text-gray-300'
                placeholder="Section Description"
              />
            ) : (
              <p className='mb-8 text-gray-600 dark:text-gray-300 transition-colors duration-300'>
                {tempData.description || "Ready to take the next step? Let's build your future together."}
              </p>
            )}

            {/* Benefits List */}
            {tempData.benefits && tempData.benefits.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Benefits:</h4>
                <ul className="space-y-2">
                  {tempData.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                      {isEditing ? (
                        <div className="flex items-center gap-2 w-full">
                          <input
                            value={benefit}
                            onChange={(e) => updateBenefit(index, e.target.value)}
                            className="w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 text-sm"
                          />
                          <Button
                            onClick={() => removeBenefit(index)}
                            size="sm"
                            variant="outline"
                            className="bg-red-50 hover:bg-red-100 text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-gray-600 dark:text-gray-300 text-sm">{benefit}</span>
                      )}
                    </li>
                  ))}
                </ul>
                {isEditing && (
                  <Button
                    onClick={addBenefit}
                    size="sm"
                    variant="outline"
                    className="mt-3 bg-green-50 hover:bg-green-100 text-green-700"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Benefit
                  </Button>
                )}
              </div>
            )}

            {isEditing && (!tempData.benefits || tempData.benefits.length === 0) && (
              <Button
                onClick={addBenefit}
                size="sm"
                variant="outline"
                className="mb-6 bg-green-50 hover:bg-green-100 text-green-700"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Benefits Section
              </Button>
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
              {isEditing ? (
                <EditableText
                  value={tempData.ctaButton}
                  onChange={(val) => updateField("ctaButton", val)}
                  className="bg-yellow-400 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white px-6 py-3 rounded-md font-semibold text-center"
                  placeholder="Button Text"
                />
              ) : (
                <Button className='bg-yellow-400 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white px-6 py-3 rounded-md font-semibold transition-colors duration-300'>
                  {tempData.ctaButton || "Sign up now"}
                </Button>
              )}
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
              src={tempData.backgroundImage || CTA}
              alt='CTA Illustration'
              className='w-full h-full object-cover opacity-65 dark:opacity-50 transition-opacity duration-300'
            />
            {isEditing && (
              <>
                <input
                  type='file'
                  accept='image/*'
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className='hidden'
                />
                <Button
                  size='sm'
                  variant='outline'
                  className='absolute top-2 right-2 bg-white/80'
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className='w-4 h-4' />
                </Button>
                {pendingImage && (
                  <p className='absolute bottom-2 left-2 text-xs text-orange-600 bg-white/80 p-1 rounded'>
                    Image selected: {pendingImage.name}
                  </p>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}