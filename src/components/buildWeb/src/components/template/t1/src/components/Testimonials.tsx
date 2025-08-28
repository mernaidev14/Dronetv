import { useState, useEffect } from "react";
import { Edit2, Check, X, Plus, Trash2 } from "lucide-react";

// Mock images for demo - in real app these would be your actual image imports
const mockImages = [
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
];

const initialTestimonials = [
  {
    id: 1,
    company: "BrightWave",
    testimonial: "Working with them was a game-changer.",
    author: "Aarav Mehta",
    position: "CEO",
    logo: mockImages[0],
  },
  {
    id: 2,
    company: "TechForward",
    testimonial: "They helped us 3x growth in 18 months.",
    author: "Sarah Chen",
    position: "CTO",
    logo: mockImages[1],
  },
  {
    id: 3,
    company: "InnovateLab",
    testimonial: "Their expertise transformed our entire business strategy.",
    author: "Michael Rodriguez",
    position: "Founder",
    logo: mockImages[2],
  },
  {
    id: 4,
    company: "CloudSync",
    testimonial: "The results exceeded all our expectations.",
    author: "Emily Watson",
    position: "COO",
    logo: mockImages[3],
  },
];

export default function EditableTestimonials() {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [current, setCurrent] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [sectionTitle, setSectionTitle] = useState("What Our Clients Say");
  const [sectionSubtitle, setSectionSubtitle] = useState(
    "Don't just take our word for it. Here's what our clients have to say about working with us."
  );
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingSubtitle, setIsEditingSubtitle] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      const interval = setInterval(
        () => setCurrent((c) => (c + 1) % testimonials.length),
        5000
      );
      return () => clearInterval(interval);
    }
  }, [testimonials.length, isEditing]);

  const handleEdit = (id, field, currentValue) => {
    setEditingId(id);
    setEditingField(field);
    setTempValue(currentValue);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editingId && editingField) {
      setTestimonials((prev) =>
        prev.map((testimonial) =>
          testimonial.id === editingId
            ? { ...testimonial, [editingField]: tempValue }
            : testimonial
        )
      );
    }
    cancelEdit();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingField(null);
    setTempValue("");
    setIsEditing(false);
  };

  const addTestimonial = () => {
    const newId = Math.max(...testimonials.map((t) => t.id)) + 1;
    const newTestimonial = {
      id: newId,
      company: "New Company",
      testimonial: "Add your testimonial here.",
      author: "Author Name",
      position: "Position",
      logo: mockImages[0],
    };
    setTestimonials((prev) => [...prev, newTestimonial]);
  };

  const deleteTestimonial = (id) => {
    if (testimonials.length > 1) {
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      if (current >= testimonials.length - 1) {
        setCurrent(0);
      }
    }
  };

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
    setTempValue(sectionTitle);
  };

  const handleSubtitleEdit = () => {
    setIsEditingSubtitle(true);
    setTempValue(sectionSubtitle);
  };

  const saveTitleEdit = () => {
    setSectionTitle(tempValue);
    setIsEditingTitle(false);
    setTempValue("");
  };

  const saveSubtitleEdit = () => {
    setSectionSubtitle(tempValue);
    setIsEditingSubtitle(false);
    setTempValue("");
  };

  const cancelTitleEdit = () => {
    setIsEditingTitle(false);
    setTempValue("");
  };

  const cancelSubtitleEdit = () => {
    setIsEditingSubtitle(false);
    setTempValue("");
  };

  const EditableText = ({ value, onEdit, isLarge = false, className = "" }) => (
    <div className={`group relative ${className}`}>
      <span className={isLarge ? "text-3xl font-bold" : ""}>{value}</span>
      <button
        onClick={onEdit}
        className='opacity-0 group-hover:opacity-100 absolute -right-6 top-0 p-1 text-gray-400 hover:text-blue-600 transition-all duration-200'
      >
        <Edit2 size={14} />
      </button>
    </div>
  );

  const EditableField = ({
    testimonial,
    field,
    className = "",
    multiline = false,
  }) => {
    const isCurrentlyEditing =
      editingId === testimonial.id && editingField === field;
    const value = testimonial[field];

    if (isCurrentlyEditing) {
      return (
        <div className='flex items-center gap-2'>
          {multiline ? (
            <textarea
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className='flex-1 px-2 py-1 border border-blue-300 rounded resize-none'
              rows={3}
              autoFocus
            />
          ) : (
            <input
              type='text'
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className='flex-1 px-2 py-1 border border-blue-300 rounded'
              autoFocus
            />
          )}
          <button
            onClick={handleSave}
            className='p-1 text-green-600 hover:text-green-800'
          >
            <Check size={16} />
          </button>
          <button
            onClick={cancelEdit}
            className='p-1 text-red-600 hover:text-red-800'
          >
            <X size={16} />
          </button>
        </div>
      );
    }

    return (
      <div className={`group relative ${className}`}>
        {multiline ? (
          <blockquote className='text-lg text-gray-700 italic'>
            "{value}"
          </blockquote>
        ) : (
          <span>{value}</span>
        )}
        <button
          onClick={() => handleEdit(testimonial.id, field, value)}
          className='opacity-0 group-hover:opacity-100 absolute -right-6 top-0 p-1 text-gray-400 hover:text-blue-600 transition-all duration-200'
        >
          <Edit2 size={14} />
        </button>
      </div>
    );
  };

  return (
    <section
      id='testimonials'
      className='bg-gray-50 py-16 scroll-mt-20 relative'
    >
      {/* Edit Mode Toggle */}
      <div className='absolute top-4 right-4 z-10'>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            isEditing
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-white text-gray-700 border border-gray-300 hover:border-blue-300"
          }`}
        >
          {isEditing ? "Exit Edit Mode" : "Edit Content"}
        </button>
      </div>

      <div className='max-w-4xl mx-auto px-6'>
        <div className='text-center mb-12'>
          {/* Editable Title */}
          {isEditingTitle ? (
            <div className='flex items-center justify-center gap-2 mb-4'>
              <input
                type='text'
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className='text-3xl font-bold text-gray-900 px-2 py-1 border border-blue-300 rounded text-center'
                autoFocus
              />
              <button
                onClick={saveTitleEdit}
                className='p-1 text-green-600 hover:text-green-800'
              >
                <Check size={18} />
              </button>
              <button
                onClick={cancelTitleEdit}
                className='p-1 text-red-600 hover:text-red-800'
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <div className='mb-4'>
              <EditableText
                value={sectionTitle}
                onEdit={handleTitleEdit}
                isLarge={true}
                className='text-3xl font-bold text-gray-900 inline-block'
              />
            </div>
          )}

          {/* Editable Subtitle */}
          {isEditingSubtitle ? (
            <div className='flex items-center justify-center gap-2'>
              <textarea
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className='text-gray-600 max-w-2xl px-2 py-1 border border-blue-300 rounded resize-none'
                rows={2}
                autoFocus
              />
              <button
                onClick={saveSubtitleEdit}
                className='p-1 text-green-600 hover:text-green-800'
              >
                <Check size={18} />
              </button>
              <button
                onClick={cancelSubtitleEdit}
                className='p-1 text-red-600 hover:text-red-800'
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <EditableText
              value={sectionSubtitle}
              onEdit={handleSubtitleEdit}
              className='text-gray-600 max-w-2xl mx-auto'
            />
          )}
        </div>

        <div className='relative overflow-hidden'>
          <div
            className='flex transition-transform duration-500 ease-in-out'
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className='w-full flex-shrink-0'>
                <div className='mx-4 bg-white shadow-lg border-0 rounded-lg relative'>
                  {/* Delete Button */}
                  {isEditing && testimonials.length > 1 && (
                    <button
                      onClick={() => deleteTestimonial(testimonial.id)}
                      className='absolute top-2 right-2 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full z-10'
                    >
                      <Trash2 size={16} />
                    </button>
                  )}

                  <div className='p-8 text-center'>
                    <div className='mb-6'>
                      <div className='w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <img
                          src={testimonial.logo}
                          alt={testimonial.company}
                          className='w-full h-full object-cover rounded-full'
                        />
                      </div>
                      <h3 className='font-semibold text-xl text-gray-900 mb-2'>
                        <EditableField
                          testimonial={testimonial}
                          field='company'
                        />
                      </h3>
                    </div>

                    <div className='mb-6'>
                      <EditableField
                        testimonial={testimonial}
                        field='testimonial'
                        multiline={true}
                      />
                    </div>

                    <div className='border-t pt-6'>
                      <p className='font-medium text-gray-900'>
                        <EditableField
                          testimonial={testimonial}
                          field='author'
                        />
                      </p>
                      <p className='text-gray-600 text-sm'>
                        <EditableField
                          testimonial={testimonial}
                          field='position'
                        />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className='flex justify-center items-center mt-8 space-x-4'>
          {/* Add Button */}
          {isEditing && (
            <button
              onClick={addTestimonial}
              className='flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200'
            >
              <Plus size={16} />
              Add Testimonial
            </button>
          )}

          {/* Pagination Dots */}
          <div className='flex space-x-2'>
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === current
                    ? "bg-blue-600"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Instructions for Edit Mode */}
        {isEditing && (
          <div className='mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200'>
            <p className='text-sm text-blue-800 mb-2'>
              <strong>Edit Mode Active:</strong> You can now:
            </p>
            <ul className='text-sm text-blue-800 space-y-1'>
              <li>
                • <strong>Edit existing content:</strong> Hover over any text
                (company name, testimonial, author, position, titles) and click
                the edit icon
              </li>
              <li>
                • <strong>Add new testimonials:</strong> Click the green "Add
                Testimonial" button
              </li>
              <li>
                • <strong>Delete testimonials:</strong> Click the red trash icon
                on any testimonial
              </li>
              <li>
                • <strong>Navigate:</strong> Use the dots below to switch
                between testimonials while editing
              </li>
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
