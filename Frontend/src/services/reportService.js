import axios from "axios";

const API_URL = "http://localhost:5000/api/reports";

export const getLatestReport = async () => {
  const response = await axios.get(
    `${API_URL}/latest`
  );

  return response.data;
};