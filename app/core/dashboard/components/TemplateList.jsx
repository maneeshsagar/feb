// /app/core/dashboard/components/TemplateList.jsx
'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '@/lib/firebase'; // For getting ID token
import { FiCheckCircle, FiLoader, FiAlertCircle, FiSave } from 'react-icons/fi'; // Icons

// Dummy template structure if API fails or for initial state
const initialTemplates = [
  // { id: '1', name: 'Modern Portfolio', description: 'A sleek modern portfolio template.', imageUrl: 'https://placehold.co/600x400/7c3aed/ffffff?text=Modern' },
  // { id: '2', name: 'Classic Resume', description: 'A classic template for resumes.', imageUrl: 'https://placehold.co/600x400/10b981/ffffff?text=Classic' },
  // { id: '3', name: 'Creative Design', description: 'A creative template for designers.', imageUrl: 'https://placehold.co/600x400/f59e0b/ffffff?text=Creative' },
];

export default function TemplateList({ user }) { // Assuming 'user' prop is passed for userId
  const [templates, setTemplates] = useState(initialTemplates);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ type: '', message: ''});

  // Fetch templates from backend
  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      setError('');
      setSaveStatus({ type: '', message: '' });

      if (!auth.currentUser) {
        setError("Authentication required to load templates.");
        setLoading(false);
        return;
      }

      try {
        const idToken = await auth.currentUser.getIdToken(false);
        // Replace '/api/template' with your actual backend endpoint for fetching templates
        const response = await axios.get('https://910fkqei24.execute-api.ap-south-1.amazonaws.com/api/template', {
          headers: {
            'Authorization': `Bearer ${idToken}`,
          },
        });

        if (response.data && Array.isArray(response.data)) {
          setTemplates(response.data);
          // Optionally, fetch and set the user's currently selected template ID here
          // For example, if your GET /api/template also returns user's current selection
          // or if you have another endpoint like GET /api/user/template
          // setSelectedTemplateId(response.data.userSelectedTemplateId || null);
        } else {
          setTemplates(initialTemplates); // Fallback to initial if data is not as expected
          console.warn("Fetched templates data is not an array or is empty:", response.data);
        }
      } catch (err) {
        console.error("Failed to fetch templates:", err);
        setError("Could not load templates. Please try again.");
        setTemplates(initialTemplates); // Fallback to initial on error
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []); // Empty dependency array: fetch only on mount

  // Handle template selection
  const handleSelectTemplate = (templateId) => {
    setSelectedTemplateId(templateId);
    setSaveStatus({ type: '', message: '' }); // Clear previous save status
  };

  // Handle saving the selected template
  const handleSaveSelection = async () => {
    if (!selectedTemplateId) {
      setSaveStatus({ type: 'error', message: 'Please select a template first.' });
      return;
    }
    if (!auth.currentUser || !user?.uid) {
        setSaveStatus({ type: 'error', message: 'Authentication error. Cannot save selection.' });
        return;
    }

    setSaving(true);
    setSaveStatus({ type: '', message: '' });

    try {
      const idToken = await auth.currentUser.getIdToken(false);
      const payload = {
        userId: user.uid, // Get userId from the user prop
        templateId: selectedTemplateId,
      };

      // Replace '/api/template' or '/api/user/template' with your actual backend endpoint for saving selection
      const response = await axios.post('/api/template', payload, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 || response.status === 201) {
        setSaveStatus({ type: 'success', message: 'Template selection saved!' });
      } else {
        setSaveStatus({ type: 'error', message: response.data?.message || 'Failed to save selection.' });
      }
    } catch (err) {
      console.error("Failed to save template selection:", err);
      setSaveStatus({ type: 'error', message: err.response?.data?.message || 'An error occurred while saving.' });
    } finally {
      setSaving(false);
      if (saveStatus.type === 'success') {
        setTimeout(() => setSaveStatus({ type: '', message: '' }), 3000);
      }
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <FiLoader className="animate-spin text-indigo-600 mr-3" size={24} />
        <p className="text-gray-600">Loading templates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-lg shadow-md flex items-center">
        <FiAlertCircle size={24} className="mr-3" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">Choose Your Profile Template</h2>
        <p className="text-gray-600 mb-6">Select a template that best represents your professional style.</p>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => handleSelectTemplate(template.id)}
            className={`relative p-1 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:-translate-y-1
                        ${selectedTemplateId === template.id ? 'ring-4 ring-indigo-500 ring-offset-2' : 'ring-1 ring-gray-200 hover:ring-indigo-300'}`}
          >
            {selectedTemplateId === template.id && (
              <div className="absolute top-3 right-3 bg-indigo-600 text-white rounded-full p-1.5 z-10">
                <FiCheckCircle size={20} />
              </div>
            )}
            <div className="bg-white rounded-md overflow-hidden">
              <img
                src={template.imageUrl || `https://placehold.co/600x400/gray/ffffff?text=${template.name.replace(/\s+/g, '+')}`}
                alt={template.name}
                className="w-full h-48 object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/600x400/gray/ffffff?text=Preview+Error`}}
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{template.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Save Button and Status */}
      {templates.length > 0 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4">
          {saveStatus.message && (
            <p className={`text-sm ${saveStatus.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {saveStatus.message}
            </p>
          )}
          <button
            onClick={handleSaveSelection}
            disabled={!selectedTemplateId || saving}
            className={`flex items-center justify-center px-6 py-3 rounded-md text-white font-medium transition duration-150 ease-in-out
                        ${(!selectedTemplateId || saving)
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        }`}
          >
            {saving ? <FiLoader className="animate-spin -ml-1 mr-2 h-5 w-5" /> : <FiSave className="-ml-1 mr-2 h-5 w-5" />}
            {saving ? 'Saving...' : 'Save Selection'}
          </button>
        </div>
      )}

       {templates.length === 0 && !loading && (
           <div className="text-center py-10">
               <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                   <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
               </svg>
               <h3 className="mt-2 text-sm font-medium text-gray-900">No templates available</h3>
               <p className="mt-1 text-sm text-gray-500">Check back later or contact support if you believe this is an error.</p>
           </div>
       )}
    </div>
  );
}
