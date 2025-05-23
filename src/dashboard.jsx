
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './styles.css';
function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Fetch tasks from API Gateway (backed by Lambda)
    setTasks([{ id: 1, title: "Sample Task", status: "Pending" }]);
  }, []);

  return (
    <div>
      <h2>Task Dashboard</h2>
      <Link to="/tasks/create">Create Task</Link>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <Link to={`/tasks/${task.id}`}>{task.title} - {task.status}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
