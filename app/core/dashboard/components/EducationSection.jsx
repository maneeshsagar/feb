import React from 'react';
import { FiPlus, FiX } from 'react-icons/fi';

export default function EducationSection({ educations, addEducation, updateEducation, removeEducation }) {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-semibold">Education</h3>
        <button
          onClick={addEducation}
          className="flex items-center text-blue-500 hover:text-blue-600"
        >
          <FiPlus size={18} className="mr-1" />
          <span className="text-sm">Add</span>
        </button>
      </div>
      {educations.map((edu, index) => (
        <div key={index} className="mb-4 p-4 border rounded-lg bg-white shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-lg font-medium">Education #{index + 1}</h4>
            <button onClick={() => removeEducation(index)} className="text-red-500 hover:text-red-600">
              <FiX size={20} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Institute Name</label>
              <input
                type="text"
                value={edu.institute}
                onChange={(e) => updateEducation(index, 'institute', e.target.value)}
                placeholder="Enter institute name"
                className="mt-1 block w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tenure</label>
              <input
                type="text"
                value={edu.tenure}
                onChange={(e) => updateEducation(index, 'tenure', e.target.value)}
                placeholder="e.g. 2015-2019"
                className="mt-1 block w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Course Name</label>
              <input
                type="text"
                value={edu.course}
                onChange={(e) => updateEducation(index, 'course', e.target.value)}
                placeholder="Enter course name"
                className="mt-1 block w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Majors</label>
              <input
                type="text"
                value={edu.majors}
                onChange={(e) => updateEducation(index, 'majors', e.target.value)}
                placeholder="Enter your major(s)"
                className="mt-1 block w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
