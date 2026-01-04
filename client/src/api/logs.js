import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || ""; // e.g. http://localhost:3000/api

export const getLogs = (date) =>
  axios.get(`${API_BASE}/logs`, { params: { date } });

export const getSummary = (date) =>
  axios.get(`${API_BASE}/logs/summary`, { params: { date } });

export const updateLog = (id, data) =>
  axios.put(`${API_BASE}/logs/${id}`, data);

export const deleteLog = (id) =>
  axios.delete(`${API_BASE}/logs/${id}`);