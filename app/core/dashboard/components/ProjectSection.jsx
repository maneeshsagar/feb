import React from 'react';
import { FiPlus, FiX } from 'react-icons/fi';

export default function ProjectSection({ projects, addProject, updateProject, removeProject }) {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-semibold">Projects</h3>
        <button
          onClick={addProject}
          className="flex items-center text-blue-500 hover:text-blue-600"
        >
          <FiPlus size={18} className="mr-1" />
          <span className="text-sm">Add</span>
        </button>
      </div>
      {projects.map((proj, index) => (
        <div key={index} className="mb-4 p-4 border rounded-lg bg-white shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-lg font-medium">Project #{index + 1}</h4>
            <button onClick={() => removeProject(index)} className="text-red-500 hover:text-red-600">
              <FiX size={20} />
            </button>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Project Name</label>
            <input
              type="text"
              value={proj.name}
              onChange={(e) => updateProject(index, 'name', e.target.value)}
              placeholder="Enter project name"
              className="mt-1 block w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Project Details</label>
            <textarea
              value={proj.details}
              onChange={(e) => updateProject(index, 'details', e.target.value)}
              placeholder="Enter project details"
              className="mt-1 block w-full p-2 border rounded"
              rows={3}
            />
          </div>
        </div>
      ))}
    </section>
  );
}
