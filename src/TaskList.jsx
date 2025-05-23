import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = 'https://l34ep2nvjl.execute-api.us-east-1.amazonaws.com/taskAPIdeployment';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error('Error fetching tasks:', err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Task List</h2>
      <Link to="/create" className="text-blue-500 underline">Create New Task</Link>
      <ul className="mt-4">
        {tasks.map(task => (
          <li key={task.id} className="mb-2">
            <Link to={`/tasks/${task.id}`} className="text-blue-600 hover:underline">
              {task.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
