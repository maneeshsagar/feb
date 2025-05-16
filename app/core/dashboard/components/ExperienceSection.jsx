import React from 'react';
import { FiPlus, FiX } from 'react-icons/fi';

export default function ExperienceSection({ experiences, addExperience, updateExperience, removeExperience }) {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-semibold">Experience</h3>
        <button
          onClick={addExperience}
          className="flex items-center text-blue-500 hover:text-blue-600"
        >
          <FiPlus size={18} className="mr-1" />
          <span className="text-sm">Add</span>
        </button>
      </div>
      {experiences.map((exp, index) => (
        <div key={index} className="mb-4 p-4 border rounded-lg bg-white shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-lg font-medium">Experience #{index + 1}</h4>
            <button onClick={() => removeExperience(index)} className="text-red-500 hover:text-red-600">
              <FiX size={20} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateExperience(index, 'company', e.target.value)}
                placeholder="Enter company name"
                className="mt-1 block w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tenure</label>
              <input
                type="text"
                value={exp.tenure}
                onChange={(e) => updateExperience(index, 'tenure', e.target.value)}
                placeholder="e.g. 2018-2020"
                className="mt-1 block w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Designation</label>
              <input
                type="text"
                value={exp.designation}
                onChange={(e) => updateExperience(index, 'designation', e.target.value)}
                placeholder="Enter designation"
                className="mt-1 block w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Details of Work</label>
              <input
                type="text"
                value={exp.details}
                onChange={(e) => updateExperience(index, 'details', e.target.value)}
                placeholder="Describe your work"
                className="mt-1 block w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
