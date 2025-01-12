import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchReports, createReport, deleteReport, updateReport } from "../redux/bagian/Laporan";
import axios from "axios";
import ReportList from './ReportList'; // Impor komponen ReportList

const Dashboard = () => {
  const [auth, setAuth] = useState(false);
  const { reports, status, error } = useSelector((state) => state.report);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ location: "", description: "" });
  const [editReportId, setEditReportId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Anda harus login untuk mengakses dashboard");
      navigate("/");
    } else {
      axios
        .get("http://localhost:5000/api/places/verify-token", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => setAuth(true))
        .catch(() => {
          alert("Token tidak valid. Silakan login kembali.");
          localStorage.removeItem("token");
          navigate("/");
        });
    }
  }, [navigate]);

  useEffect(() => {
    if (auth) {
      dispatch(fetchReports());
    }
  }, [auth, dispatch]);

  useEffect(() => {
    if (status === "succeeded") {
      console.log("Data yang diupdate:", reports);
    }
  }, [status, reports]);

  useEffect(() => {
    if (status === "failed") {
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
      alert("Location dan Description harus diisi!");
      return;
    }

    if (editReportId) {
      const dataToSend = { _id: editReportId, ...formData };
      dispatch(updateReport(dataToSend));
    } else {
      dispatch(createReport(formData));
    }

    setFormData({ location: "", description: "" });
    setEditReportId(null);
  };

  const handleDelete = (id) => {
    dispatch(deleteReport(id));
  };

  const handleEdit = (report) => {
    setFormData({ location: report.location, description: report.description });
    setEditReportId(report._id);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Anda telah logout");
    navigate("/");
  };

  if (!auth) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>

      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Informasi Dampak Kekeringan</h2>

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
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
          >
            {editReportId ? "Update Report" : "Add Report"}
          </button>
        </form>

        {/* Reports List */}
        <h3 className="text-xl font-bold mb-4 text-center">Reports</h3>
        <ReportList
          reports={reports}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Dashboard;
