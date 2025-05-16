// /app/core/dashboard/components/ProfileEditor.jsx
'use client';
import React, { useEffect, useState, useRef } from 'react';
// FiUploadCloud is removed as image upload functionality is removed
import { FiPlus, FiX, FiSave, FiLoader } from 'react-icons/fi';
import axios from 'axios';
import { auth } from '@/lib/firebase'; // Import auth object

// --- Default data structure ---
const defaultExperiences = [{ company: '', tenure: '', designation: '', details: '' }];
const defaultEducations = [{ institute: '', tenure: '', course: '', majors: '' }];
const defaultProjects = [{ name: '', details: '' }];
// ---

export default function ProfileEditor({ user }) {
  // State for dynamic fields
  const [experiences, setExperiences] = useState(defaultExperiences);
  const [educations, setEducations] = useState(defaultEducations);
  const [projects, setProjects] = useState(defaultProjects);

  // State for basic profile info
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');

  // --- State for Profile Picture Upload REMOVED ---
  // const [selectedFile, setSelectedFile] = useState(null);
  // const [imagePreview, setImagePreview] = useState(null);
  // const fileInputRef = useRef(null);

  // Loading and Saving States
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });

  console.log("ProfileEditor rendered. User prop:", user);

  // Fetch existing profile data
  useEffect(() => {
    const fetchProfile = async () => {
      console.log("fetchProfile triggered inside useEffect");
      setLoadingProfile(true);
      setSaveStatus({ type: '', message: '' });

      if (!auth.currentUser) {
          console.error("fetchProfile: No authenticated user found.");
          setSaveStatus({ type: 'error', message: 'Authentication error. Please log in again.' });
          setLoadingProfile(false);
          return;
      }

      try {
        console.log("fetchProfile: Getting ID token...");
        const idToken = await auth.currentUser.getIdToken(false);
        console.log("fetchProfile: Got ID token. Making GET request to /api/profile");
        const response = await axios.get('https://910fkqei24.execute-api.ap-south-1.amazonaws.com/api/profile', { // Ensure this URL is correct
            headers: {
                'Authorization': `Bearer ${idToken}`,
            }
        });
        console.log("fetchProfile: GET request successful. Response data:", response.data);

        const profileData = response.data;
        setExperiences(Array.isArray(profileData.experiences) && profileData.experiences.length ? profileData.experiences : defaultExperiences);
        setEducations(Array.isArray(profileData.educations) && profileData.educations.length ? profileData.educations : defaultEducations);
        setProjects(Array.isArray(profileData.projects) && profileData.projects.length ? profileData.projects : defaultProjects);
        setDisplayName(profileData.displayName || user?.displayName || '');
        setRole(profileData.role || user?.role || 'Designer');
        setBio(profileData.bio || '');
        // Image is directly from user.photoURL, not editable in this version
      } catch (error) {
        console.error('fetchProfile: Failed to fetch profile data:', error.response?.data || error.message);
        if (error.response?.status === 401 || error.response?.status === 403) {
             setSaveStatus({ type: 'error', message: 'Authentication failed. Please log in again.' });
        } else {
             setSaveStatus({ type: 'error', message: 'Could not load profile data.' });
        }
        // Fallback to default or user prop data
        setExperiences(defaultExperiences);
        setEducations(defaultEducations);
        setProjects(defaultProjects);
        setDisplayName(user?.displayName || '');
        setRole(user?.role || 'Designer');
        setBio('');
      } finally {
        console.log("fetchProfile: Finished.");
        setLoadingProfile(false);
      }
    };

    if (user) {
        console.log("useEffect: User prop exists, initializing state and calling fetchProfile.");
        setDisplayName(user.displayName || '');
        setRole(user.role || 'Designer'); // Initialize role from user prop or default
        // Image will be taken directly from user.photoURL in the JSX
        fetchProfile();
    } else {
        console.log("useEffect: No user prop, skipping fetchProfile.");
        setLoadingProfile(false);
    }
  }, [user]);

  // --- Add/Update/Remove Handlers ---
  const addExperience = () => setExperiences(prev => [...prev, { company: '', tenure: '', designation: '', details: '' }]);
  const updateExperience = (index, field, value) => setExperiences(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  const removeExperience = (indexToRemove) => setExperiences(currentExperiences => currentExperiences.filter((_, index) => index !== indexToRemove));

  const addEducation = () => setEducations(prev => [...prev, { institute: '', tenure: '', course: '', majors: '' }]);
  const updateEducation = (index, field, value) => setEducations(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  const removeEducation = (indexToRemove) => setEducations(currentEducations => currentEducations.filter((_, index) => index !== indexToRemove));

  const addProject = () => setProjects(prev => [...prev, { name: '', details: '' }]);
  const updateProject = (index, field, value) => setProjects(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  const removeProject = (indexToRemove) => setProjects(currentProjects => currentProjects.filter((_, index) => index !== indexToRemove));

  // --- Profile Picture Handlers REMOVED ---

  // --- UPDATED handleSave Function (Sends JSON) ---
  const handleSave = async () => {
    console.log("handleSave: Function triggered.");
    setIsSaving(true);
    setSaveStatus({ type: '', message: '' });

    if (!auth.currentUser) {
        console.error("handleSave: Cannot save profile - No authenticated user.");
        setSaveStatus({ type: 'error', message: 'Authentication error. Please log in again.' });
        setIsSaving(false);
        return;
    }
    console.log("handleSave: User is authenticated.");

    // Create the JSON payload object directly
    const payload = {
      userId: user?.uid,
      displayName,
      role,
      bio,
      experiences,
      educations,
      projects,
      // Note: photoURL is not sent from here, backend should preserve existing or handle separately
    };
    console.log("handleSave: Payload created:", payload);

    try {
      console.log("handleSave: Getting ID token...");
      const idToken = await auth.currentUser.getIdToken(false);
      console.log("handleSave: Got ID token:", idToken ? 'Yes' : 'No');

      if (!idToken) {
          console.error("handleSave: Failed to get ID token.");
          setSaveStatus({ type: 'error', message: 'Could not authenticate request.' });
          setIsSaving(false);
          return;
      }

      console.log("handleSave: Attempting axios.post to /api/profile with JSON payload...");
      // Send the payload as JSON
      const response = await axios.post(
          'http://localhost:8080/api/profile', // URL
          payload,        // Data (JSON object)
          {               // Config object
              headers: {
                  'Authorization': `Bearer ${idToken}`,
                  'Content-Type': 'application/json', // Explicitly set Content-Type
              }
          }
      );
      console.log("handleSave: axios.post successful. Status:", response.status);

      if (response.status === 200) {
        setSaveStatus({ type: 'success', message: 'Profile saved successfully!' });
        // If backend updates user info (like displayName) and returns it, you might update state here
        // For example: if (response.data.updatedProfile) setDisplayName(response.data.updatedProfile.displayName);
      } else {
        console.warn("handleSave: Save request returned non-200 status:", response.status);
        setSaveStatus({ type: 'error', message: `Save failed: ${response.statusText}` });
      }
    } catch (error) {
      console.error('handleSave: Error during API call:', error.response || error);
      setSaveStatus({ type: 'error', message: error.response?.data?.message || 'Profile save failed.' });
    } finally {
      console.log("handleSave: Finished.");
      setIsSaving(false);
      if (saveStatus.type === 'success') {
        setTimeout(() => setSaveStatus({ type: '', message: '' }), 3000);
      }
    }
  };
  // --- End handleSave ---


  // --- Loading State ---
  if (loadingProfile) {
    return (
      <div className="flex justify-center items-center py-10">
        <FiLoader className="animate-spin text-indigo-600 mr-3" size={24} />
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  // --- Main JSX ---
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Picture Card (Display Only) */}
          <div className="bg-white p-6 rounded-lg shadow">
             <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Picture</h3>
             <div className="flex flex-col items-center space-y-4">
                <img
                   src={user?.photoURL || "/default-avatar.png"} // Directly use user's photoURL
                   alt="Profile"
                   className="w-32 h-32 rounded-full object-cover ring-2 ring-offset-2 ring-indigo-200"
                 />
                 {/* "Change Picture" button removed */}
             </div>
           </div>
          {/* Basic Information Card */}
          <div className="bg-white p-6 rounded-lg shadow">
             <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
             <div className="space-y-4">
                <InputField label="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your Name" disabled={isSaving}/>
                <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1 text-sm text-gray-700 bg-gray-50 p-2 rounded-md">{user?.email || "N/A"}</p>
                </div>
                <InputField label="Role / Title" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Software Engineer" disabled={isSaving}/>
                <InputField label="Short Bio" type="textarea" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us a bit about yourself..." rows={3} disabled={isSaving}/>
             </div>
           </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-2 space-y-8">
           {/* Experience Section */}
          <section className="bg-white p-6 rounded-lg shadow">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-semibold text-gray-800">Experience</h3>
               <button onClick={addExperience} className="add-button" disabled={isSaving}>
                 <FiPlus size={18} className="mr-1" /> Add Experience
               </button>
             </div>
             <div className="space-y-4">
                {experiences.map((exp, index) => (
                    <div key={`exp-${index}`} className="item-card">
                        <button onClick={() => removeExperience(index)} className="remove-button" disabled={isSaving} aria-label="Remove experience"> <FiX size={18} /> </button>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InputField label="Company Name" value={exp.company} onChange={(e) => updateExperience(index, 'company', e.target.value)} placeholder="Company Inc." disabled={isSaving}/>
                          <InputField label="Tenure" value={exp.tenure} onChange={(e) => updateExperience(index, 'tenure', e.target.value)} placeholder="e.g. 2020-Present" disabled={isSaving}/>
                          <InputField label="Designation" value={exp.designation} onChange={(e) => updateExperience(index, 'designation', e.target.value)} placeholder="Your Role" disabled={isSaving}/>
                          <InputField label="Details of Work" type="textarea" value={exp.details} onChange={(e) => updateExperience(index, 'details', e.target.value)} placeholder="Describe your work..." rows={3} disabled={isSaving}/>
                       </div>
                    </div>
                ))}
             </div>
          </section>

          {/* Education Section */}
          <section className="bg-white p-6 rounded-lg shadow">
             <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-semibold text-gray-800">Education</h3>
                 <button onClick={addEducation} className="add-button" disabled={isSaving}> <FiPlus size={18} className="mr-1" /> Add Education </button>
             </div>
             <div className="space-y-4">
                {educations.map((edu, index) => (
                    <div key={`edu-${index}`} className="item-card">
                        <button onClick={() => removeEducation(index)} className="remove-button" disabled={isSaving} aria-label="Remove education"> <FiX size={18} /> </button>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InputField label="Institute Name" value={edu.institute} onChange={(e) => updateEducation(index, 'institute', e.target.value)} placeholder="University Name" disabled={isSaving}/>
                          <InputField label="Tenure" value={edu.tenure} onChange={(e) => updateEducation(index, 'tenure', e.target.value)} placeholder="e.g. 2016-2020" disabled={isSaving}/>
                          <InputField label="Course Name" value={edu.course} onChange={(e) => updateEducation(index, 'course', e.target.value)} placeholder="B.Sc. Computer Science" disabled={isSaving}/>
                          <InputField label="Majors" value={edu.majors} onChange={(e) => updateEducation(index, 'majors', e.target.value)} placeholder="Software Engineering" disabled={isSaving}/>
                       </div>
                    </div>
                ))}
             </div>
          </section>

           {/* Projects Section */}
           <section className="bg-white p-6 rounded-lg shadow">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Projects</h3>
                  <button onClick={addProject} className="add-button" disabled={isSaving}> <FiPlus size={18} className="mr-1" /> Add Project </button>
               </div>
               <div className="space-y-4">
                   {projects.map((proj, index) => (
                       <div key={`proj-${index}`} className="item-card">
                           <button onClick={() => removeProject(index)} className="remove-button" disabled={isSaving} aria-label="Remove project"> <FiX size={18} /> </button>
                           <div className="space-y-4">
                               <InputField label="Project Name" value={proj.name} onChange={(e) => updateProject(index, 'name', e.target.value)} placeholder="My Awesome Project" disabled={isSaving}/>
                               <InputField label="Project Details" type="textarea" value={proj.details} onChange={(e) => updateProject(index, 'details', e.target.value)} placeholder="Describe the project..." rows={4} disabled={isSaving}/>
                           </div>
                       </div>
                   ))}
               </div>
           </section>

           {/* Save Button Area */}
           <div className="flex justify-end items-center pt-4">
               {saveStatus.message && ( <p className={`mr-4 text-sm ${saveStatus.type === 'success' ? 'text-green-600' : 'text-red-600'}`}> {saveStatus.message} </p> )}
                <button
                   onClick={() => { console.log('Save Profile button clicked. Sending JSON.'); handleSave(); }}
                   disabled={isSaving || loadingProfile}
                   className={`save-button ${isSaving ? 'saving' : ''}`}
                >
                    {isSaving ? <FiLoader className="animate-spin -ml-1 mr-2 h-5 w-5" /> : <FiSave className="-ml-1 mr-2 h-5 w-5" />}
                    {isSaving ? 'Saving...' : 'Save Profile'}
                </button>
           </div>
        </div>

      </div>
      {/* Helper CSS */}
       <style jsx>{`
           .add-button { display: flex; align-items: center; font-size: 0.875rem; color: #4f46e5; font-weight: 500; padding: 0.25rem; border-radius: 0.375rem; transition: background-color 150ms ease-in-out, color 150ms ease-in-out; }
           .add-button:hover:not(:disabled) { color: #3730a3; background-color: #eef2ff; }
           .add-button:disabled { opacity: 0.5; cursor: not-allowed; }
           .item-card { position: relative; padding: 1rem; border-width: 1px; border-color: #e5e7eb; border-radius: 0.375rem; background-color: #f9fafb; }
           .remove-button { position: absolute; top: 0.5rem; right: 0.5rem; color: #f87171; padding: 0.25rem; border-radius: 9999px; transition: background-color 150ms ease-in-out, color 150ms ease-in-out; }
           .remove-button:hover:not(:disabled) { color: #dc2626; background-color: #fee2e2; }
           .remove-button:disabled { opacity: 0.5; cursor: not-allowed; }
           .save-button { display: flex; align-items: center; justify-content: center; padding: 0.5rem 1.5rem; border-radius: 0.375rem; color: white; font-weight: 500; transition: background-color 150ms ease-in-out; background-color: #4f46e5; border: none; }
            .save-button:hover:not(:disabled) { background-color: #4338ca; }
           .save-button.saving, .save-button:disabled { background-color: #a5b4fc; cursor: not-allowed; }
        `}</style>
    </div>
  );
}


// --- Reusable Input Field Component ---
const InputField = ({ label, type = 'text', value, onChange, placeholder, rows = 2, disabled = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {type === 'textarea' ? (
      <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} disabled={disabled} className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
    ) : (
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
    )}
  </div>
);
