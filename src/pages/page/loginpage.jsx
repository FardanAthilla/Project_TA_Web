import React, { useState, useEffect } from 'react';
import Parallax from 'parallax-js';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/image/logo.png';
import { login } from '../../service/fetchapi';

function LoginPage() {
  useEffect(() => {
    const scene = document.getElementById('scene');
    new Parallax(scene);
  }, []);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(username, password);
    setLoading(false);

    if (result.success) {
      console.log('Login berhasil:', result.data);
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-b from-black to-[#0D99FF] text-white overflow-hidden relative">
      <div
        id="scene"
        className="absolute w-full h-full"
        data-hover-only="false"
      >
        {/* More Stars for parallax effect */}
        <div className="absolute w-full h-full" data-depth="0.60">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full opacity-80 animate-twinkle glow-star"
              style={{
                width: `${Math.random() * 2}px`,
                height: `${Math.random() * 2}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            ></div>
          ))}
        </div>

        {/* Particles for parallax effect */}
        <div className="absolute w-full h-full" data-depth="0.50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-yellow-400 rounded-full opacity-70 animate-pulse glow-particle"
              style={{
                width: `${Math.random() * 3}px`,
                height: `${Math.random() * 3}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            ></div>
          ))}
        </div>

        {/* Meteors for parallax effect */}
        <div className="absolute w-full h-full" data-depth="0.85">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-8 bg-gray-300 rounded-full opacity-60 animate-meteor glow-meteor"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: 'rotate(45deg) translate(-50%, -50%)',
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="relative z-10 bg-white p-8 rounded shadow-md w-96">
        <div className="flex justify-center mb-6">
          <img src={Logo} />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Login
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400" // tambahkan text-black di sini
              placeholder="Masukkan Username"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400" // tambahkan text-black di sini
              placeholder="Masukkan Password"
            />
          </div>
          {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full h-12 text-white font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-lg hover:scale-105 duration-200 hover:drop-shadow-2xl hover:shadow-[#7dd3fc] hover:cursor-pointer"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
