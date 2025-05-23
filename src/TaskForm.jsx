import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://l34ep2nvjl.execute-api.us-east-1.amazonaws.com/taskAPIdeployment';

const CreateTaskForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      navigate('/');
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Task</h2>
      <label className="block mb-2">
        Title:
        <input
          className="w-full border p-2 mt-1"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </label>
      <label className="block mb-4">
        Description:
        <textarea
          className="w-full border p-2 mt-1"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </label>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Create
      </button>
    </form>
  );
};

export default CreateTaskForm;
