import React from 'react';
import './NotFound.css'; 
import { FaHome } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="relative h-screen bg-gray-100 overflow-hidden">
      <div className="parallax-bg absolute top-0 left-0 w-full h-full bg-fixed bg-cover bg-center"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-9xl font-extrabold text-white drop-shadow-md animate-bounce">404</h1>
        <p className="text-2xl text-gray-200 mb-8">Oops! The page you're looking for doesn't exist.</p>
        <a href="/" className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition transform hover:scale-105">
          <FaHome className="mr-2" /> Go Back Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
