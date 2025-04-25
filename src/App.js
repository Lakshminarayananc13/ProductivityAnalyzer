import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import TaskList from "./components/TaskList";
import AddTask from "./components/AddTask";
import NavBar from "./components/NavBar"; // Import NavBar

function App() {
  const username = localStorage.getItem("username");

  return (
    <BrowserRouter>
      {username && <NavBar />} {/* Show NavBar only if logged in */}
      <Routes>
        <Route path="/" element={!username ? <Login /> : <Navigate to="/tasks" />} />
        <Route path="/register" element={!username ? <Register /> : <Navigate to="/tasks" />} />
        <Route path="/tasks" element={username ? <TaskList /> : <Navigate to="/" />} />
        <Route path="/add" element={username ? <AddTask /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;