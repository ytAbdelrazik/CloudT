import './aws-config.js';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router'; // make sure this exports createBrowserRouter([...])
import './aws-config.js';         // AWS Amplify config file
import './index.css';          // your global styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
