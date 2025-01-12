import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchReports, createReport, deleteReport } from '../redux/bagian/Laporan';

const Dashboard = () => {
  const { reports } = useSelector((state) => state.report);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ location: '', description: '' });

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createReport(formData));
    setFormData({ location: '', description: '' });
  };

  const handleDelete = (id) => {
    dispatch(deleteReport(id));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      {/* Report Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 w-full"
            required
          ></textarea>
        </div>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Add Report
        </button>
      </form>

      {/* Reports List */}
      <h3 className="text-xl font-bold mb-4">Reports</h3>
      <ul className="space-y-4">
        {reports.map((report) => (
          <li key={report.id} className="border rounded p-4 flex justify-between items-center">
            <div>
              <p className="font-bold">Location: {report.location}</p>
              <p>Description: {report.description}</p>
            </div>
            <button
              onClick={() => handleDelete(report.id)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
