import './styles.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import SignUp from "./signup";
import SignIn from "./signin";
import Dashboard from "./dashboard";
import CreateTask from "./createtask";
import TaskDetails from "./TaskDetail";  // Adjusted import path

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/TaskForm" element={<CreateTask />} />
        <Route path="/TaskDetail" element={<TaskDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
