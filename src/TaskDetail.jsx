import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE = 'https://l34ep2nvjl.execute-api.us-east-1.amazonaws.com/taskAPIdeployment';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/${id}`)
      .then(res => res.json())
      .then(data => {
        setTask(data);
        setLoading(false);
      })
      .catch(err => console.error('Error fetching task:', err));
  }, [id]);

  const handleUpdate = async () => {
    try {
      await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      alert('Task updated!');
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      navigate('/');
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Task Detail</h2>
      <label className="block mb-2">
        Title:
        <input
          className="w-full border p-2 mt-1"
          value={task.title}
          onChange={e => setTask({ ...task, title: e.target.value })}
        />
      </label>
      <label className="block mb-4">
        Description:
        <textarea
          className="w-full border p-2 mt-1"
          value={task.description}
          onChange={e => setTask({ ...task, description: e.target.value })}
        />
      </label>
      <div className="flex gap-2">
        <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2 rounded">
          Update
        </button>
        <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskDetail;
