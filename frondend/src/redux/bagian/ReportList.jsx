import React from 'react';

const ReportList = ({ reports, onEdit, onDelete }) => {
  return (
    <ul className="space-y-4">
      {reports.map((report) => (
        <li key={report._id} className="border rounded p-4 flex justify-between items-center">
          <div>
            <p className="font-bold">Location: {report.location}</p>
            <p>Description: {report.description}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(report)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(report._id)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ReportList;
