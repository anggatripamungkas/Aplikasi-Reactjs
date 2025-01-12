import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  reports: [],
  status: 'idle',
  error: null,
};

export const fetchReports = createAsyncThunk('reports/fetchReports', async () => {
  const response = await axios.get('http://localhost:5000/api/reports');
  return response.data;
});

export const createReport = createAsyncThunk('reports/createReport', async (report) => {
  const response = await axios.post('http://localhost:5000/api/reports', report);
  return response.data;
});

export const deleteReport = createAsyncThunk('reports/deleteReport', async (id) => {
  await axios.delete(`http://localhost:5000/api/reports/${id}`);
  return id;
});

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.reports = action.payload;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.reports.push(action.payload);
      })
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.reports = state.reports.filter((report) => report.id !== action.payload);
      });
  },
});

export default reportSlice.reducer;
