import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchReports, createReport, deleteReport } from '../redux/bagian/Laporan';
import axios from 'axios';

const Dashboard = () => {
  const [auth, setAuth] = useState(false);
  const { reports, status, error } = useSelector((state) => state.report);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ location: '', description: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token di localStorage:', token);
    if (!token) {
      alert('Anda harus login untuk mengakses dashboard');
      navigate('/');
    } else {
      axios
        .get('http://localhost:5000/api/places/verify-token', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => setAuth(true))
        .catch(() => {
          alert('Token tidak valid. Silakan login kembali.');
          localStorage.removeItem('token');
          navigate('/');
        });
    }
  }, [navigate]);

  useEffect(() => {
    if (auth) {
      dispatch(fetchReports());
    }
  }, [auth, dispatch]);

  useEffect(() => {
    if (status === 'failed') {
      alert(`Error: ${error}`);
    }
  }, [status, error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.location.trim() || !formData.description.trim()) {
      alert('Location dan Description harus diisi!');
      return;
    }
    dispatch(createReport(formData));
    setFormData({ location: '', description: '' });
  };

  const handleDelete = (id) => {
    dispatch(deleteReport(id));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('Anda telah logout');
    navigate('/');
  };

  if (!auth) return null;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      {/* Tombol Logout */}
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mb-4"
      >
        Logout
      </button>

      {/* Report Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Location</label>
          <input
            type="text"
            name="location"
            placeholder="Masukkan lokasi"
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
            placeholder="Deskripsikan kondisi di lokasi"
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
