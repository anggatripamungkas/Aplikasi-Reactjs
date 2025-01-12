import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  reports: [],
  status: 'idle',
  error: null,
};

export const fetchReports = createAsyncThunk(
  'reports/fetchReports',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5000/api/places');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching reports');
    }
  }
);

export const createReport = createAsyncThunk(
  'reports/createReport',
  async (report, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/places', report);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error creating report');
    }
  }
);

export const deleteReport = createAsyncThunk(
  'reports/deleteReport',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:5000/api/places/${id}`);
      return id;
    } catch (error) {
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
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.reports = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.reports.push(action.payload);
        state.error = null;
      })
      .addCase(createReport.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.reports = state.reports.filter((report) => report.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteReport.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default reportSlice.reducer;
