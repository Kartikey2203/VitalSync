import axios from "axios";

const API_URL = "http://localhost:5000/api/reports";

export const getLatestReport = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    `${API_URL}/latest`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};

export const uploadReport = async (file) => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("report", file);
  const response = await axios.post(
    `${API_URL}/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      },
    }
  );
  return response.data;
};

export const getAllReports = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    `${API_URL}/all`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

export const deleteReport = async (id) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(
    `${API_URL}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};