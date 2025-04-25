import axios from "axios";

export const getTasks = () => {
  const sheetApiUrl = localStorage.getItem("sheetApiUrl"); // Retrieve the Sheet API URL
  return axios.get(sheetApiUrl);
};

export const addTask = (task) => {
  const sheetApiUrl = localStorage.getItem("sheetApiUrl"); // Retrieve the Sheet API URL
  return axios.post(sheetApiUrl, { data: task });
};

// Delete a task by task_name
export const deleteTask = (taskName) => {
  const sheetApiUrl = localStorage.getItem("sheetApiUrl"); // Retrieve the Sheet API URL
  return axios.delete(`${sheetApiUrl}/task_name/${taskName}`);
};

export const getUsers = () => axios.get("https://sheetdb.io/api/v1/kvx9tfawpa2vs");
export const addUser = (user) => axios.post("https://sheetdb.io/api/v1/kvx9tfawpa2vs", { data: user });