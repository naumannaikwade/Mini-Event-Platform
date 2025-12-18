import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsAPI } from '../../services/api';

const EventForm = ({ edit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: '',
    category: 'Tech',
    image: null
  });
  
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (edit && id) {
      fetchEvent();
    }
  }, [edit, id]);

  const fetchEvent = async () => {
    try {
      const response = await eventsAPI.getEvent(id);
      const event = response.data.data;
      
      // Format date for datetime-local input
      const eventDate = new Date(event.date);
      const formattedDate = eventDate.toISOString().slice(0, 16);
      
      setFormData({
        title: event.title,
        description: event.description,
        date: formattedDate,
        location: event.location,
        capacity: event.capacity.toString(),
        category: event.category,
        image: null
      });
      
      if (event.image && event.image.url && event.image.url !== "no-image.jpg") {
      setImagePreview(event.image.url);
      }
    } catch (err) {
      console.error('Error fetching event:', err);
      alert('Failed to load event data');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date and time are required';
    } else {
      const eventDate = new Date(formData.date);
      if (isNaN(eventDate.getTime())) {
        newErrors.date = 'Invalid date format';
      } else if (eventDate < new Date()) {
        newErrors.date = 'Event date must be in the future';
      }
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.capacity || parseInt(formData.capacity) < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    } else if (parseInt(formData.capacity) > 1000) {
      newErrors.capacity = 'Capacity cannot exceed 1000';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'image') {
      const file = files[0];
      setFormData(prev => ({ ...prev, image: file }));
      
      if (file) {
        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
          return;
        }
        
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
          setErrors(prev => ({ ...prev, image: 'Only JPEG, PNG, and GIF images are allowed' }));
          return;
        }
        
        setErrors(prev => ({ ...prev, image: null }));
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      // Clear error for this field when user starts typing
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: null }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      
      // Fix: Proper date validation before sending
      const eventDate = new Date(formData.date);
      if (isNaN(eventDate.getTime())) {
        throw new Error('Invalid date format');
      }
      formDataToSend.append('date', eventDate.toISOString());
      
      formDataToSend.append('location', formData.location.trim());
      formDataToSend.append('capacity', parseInt(formData.capacity));
      formDataToSend.append('category', formData.category);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      if (edit) {
        await eventsAPI.updateEvent(id, formDataToSend);
        alert('Event updated successfully!');
      } else {
        await eventsAPI.createEvent(formDataToSend);
        alert('Event created successfully!');
      }
      
      navigate('/events');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save event';
      alert(`Error: ${errorMessage}`);
      console.error('Event form error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          {edit ? 'Edit Event' : 'Create New Event'}
        </h1>
        <p className="text-xl text-gray-800 max-w-2xl mx-auto">
          {edit 
            ? 'Update your event details and share with your audience.'
            : 'Fill in the details below to create an amazing event.'}
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Event Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className={`w-full px-5 py-3.5 bg-gray-50 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-600 outline-none transition-colors`}
              placeholder="Enter a descriptive event title"
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Description <span className="text-red-600">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              className={`w-full px-5 py-3.5 bg-gray-50 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-600 outline-none transition-colors`}
              placeholder="Describe your event in detail. What will attendees learn or experience?"
            />
            <div className="flex justify-between mt-2">
              {errors.description ? (
                <p className="text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.description}
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  Be descriptive to attract more attendees
                </p>
              )}
              <p className="text-sm text-gray-600">
                {formData.description.length}/500 characters
              </p>
            </div>
          </div>

          {/* Date & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Date & Time <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className={`w-full px-5 py-3.5 bg-gray-50 border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 outline-none transition-colors`}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              {errors.date && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.date}
                </p>
              )}
              <p className="mt-2 text-sm text-gray-700">
                Select a future date and time for your event
              </p>
            </div>
            
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Location <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className={`w-full px-5 py-3.5 bg-gray-50 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-600 outline-none transition-colors`}
                placeholder="e.g., Convention Center, Online, Park Name"
              />
              {errors.location && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.location}
                </p>
              )}
            </div>
          </div>

          {/* Capacity & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Capacity <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  min="1"
                  max="1000"
                  className={`w-full px-5 py-3.5 bg-gray-50 border ${errors.capacity ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-600 outline-none transition-colors`}
                  placeholder="Maximum number of attendees"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              {errors.capacity && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.capacity}
                </p>
              )}
              <p className="mt-2 text-sm text-gray-700">
                Set a limit to manage your event effectively
              </p>
            </div>
            
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 outline-none transition-colors"
              >
                <option value="Tech" className="text-gray-900">Tech</option>
                <option value="Business" className="text-gray-900">Business</option>
                <option value="Social" className="text-gray-900">Social</option>
                <option value="Educational" className="text-gray-900">Educational</option>
                <option value="Sports" className="text-gray-900">Sports</option>
                <option value="Other" className="text-gray-900">Other</option>
              </select>
              <p className="mt-2 text-sm text-gray-700">
                Choose the category that best fits your event
              </p>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Event Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                name="image"
                id="image-upload"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900 mb-1">
                      {formData.image ? 'Change Image' : 'Upload Event Image'}
                    </p>
                    <p className="text-gray-700">
                      {formData.image 
                        ? formData.image.name 
                        : 'Drag & drop or click to browse (Max 5MB)'}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Supported formats: JPG, PNG, GIF
                    </p>
                  </div>
                </div>
              </label>
            </div>
            
            {errors.image && (
              <p className="mt-3 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.image}
              </p>
            )}
            
            {imagePreview && (
              <div className="mt-6">
                <p className="text-lg font-semibold text-gray-900 mb-3">Image Preview</p>
                <div className="relative rounded-xl overflow-hidden border border-gray-300 max-w-md">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-64 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, image: null }));
                      setImagePreview(null);
                      document.getElementById('image-upload').value = '';
                    }}
                    className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {edit ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    {edit ? 'Update Event' : 'Create Event'}
                    <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/events')}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Cancel
              </button>
            </div>
            
            <p className="text-sm text-gray-700 mt-6 text-center">
              <span className="text-red-600">*</span> Required fields
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
