import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  reports: [],
  status: 'idle',
  error: null,
};

// Fetch reports from the server
export const fetchReports = createAsyncThunk(
  'reports/fetchReports',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/places', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched Reports:", response.data); // Log the fetched data
      return response.data;
    } catch (error) {
      console.error("Fetch Error:", error.response?.data || error.message); // Log errors
      return rejectWithValue(error.response?.data || 'Error fetching reports');
    }
  }
);

// Create a new report
export const createReport = createAsyncThunk(
  'reports/createReport',
  async (report, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    console.log("Token Sent:", token); // Log the token being sent

    try {
      const response = await axios.post(
        'http://localhost:5000/api/places',
        report,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Create Report Error:", error.response?.data || error.message); // Log errors
      return rejectWithValue(error.response?.data || 'Error creating report');
    }
  }
);

// Update an existing report
export const updateReport = createAsyncThunk(
  'reports/updateReport',
  async ({ id, report }, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(
        `http://localhost:5000/api/places/${id}`,
        report,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Update Report Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || 'Error updating report');
    }
  }
);

// Delete a report
export const deleteReport = createAsyncThunk(
  'reports/deleteReport',
  async (id, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Token tidak ada');
    }

    try {
      console.log("Deleting report with ID:", id); // Log the report being deleted
      await axios.delete(`http://localhost:5000/api/places/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (error) {
      console.error("Delete Error:", error.response?.data || error.message); // Log errors
      return rejectWithValue(error.response?.data || 'Error deleting report');
    }
  }
);

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchReports actions
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.reports = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Handle createReport actions
      .addCase(createReport.fulfilled, (state, action) => {
        state.reports.push(action.payload);
        state.error = null;
      })
      .addCase(createReport.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Handle updateReport actions
      .addCase(updateReport.fulfilled, (state, action) => {
        const index = state.reports.findIndex((report) => report._id === action.payload._id);
        if (index !== -1) {
          state.reports[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateReport.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Handle deleteReport actions
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.reports = state.reports.filter((report) => report._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteReport.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default reportSlice.reducer;
