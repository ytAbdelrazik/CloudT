// src/components/CreateTask.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './styles.css';
function CreateTask() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleCreate = async () => {
    // Upload file to S3, send task data to Lambda via API Gateway
    alert("Task creation functionality to be integrated with API Gateway and S3");
    navigate("/dashboard");
  };

  return (
    <div>
      <h2>Create Task</h2>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task Title" />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleCreate}>Create</button>
    </div>
  );
}

export default CreateTask;