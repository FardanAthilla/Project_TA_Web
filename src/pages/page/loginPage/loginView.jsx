import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Logo from "../../../assets/image/logo.png";
import LoginImage from "../../../assets/image/gambar.png";
import { login } from "../../../service/fetchapi";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    type: "",
  });
  const [fade, setFade] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (snackbar.visible) {
      setFade(true);
      const timer = setTimeout(() => {
        setFade(false);
        setTimeout(() => {
          setSnackbar({ visible: false, message: "", type: "" });
        }, 500);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbar]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setSnackbar({
        visible: true,
        message: "Gagal, Harap isi semua textfield nya.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    const result = await login(username, password);
    setLoading(false);

    if (result.success) {
      console.log("Login berhasil:", result.data);
      Cookies.set("Token", result.data.Token);
      setSnackbar({
        visible: true,
        message: "Login Berhasil.",
        type: "success",
      });
      setTimeout(() => navigate("/"), 1500);
    } else {
      setSnackbar({
        visible: true,
        message: result.message || "Gagal, Username tidak ditemukan.",
        type: "error",
      });
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-b from-black to-[#0D99FF] text-white overflow-hidden relative">
      {snackbar.visible && (
        <div
          role="alert"
          className={`alert ${
            snackbar.type === "success" ? "alert-success" : "alert-error"
          } fixed top-4 w-96 mx-auto z-20 transition-opacity duration-500 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            {snackbar.type === "success" ? (
              <path 
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            )}
          </svg>
          <span>{snackbar.message}</span>
        </div>
      )}

      <div className="relative z-10 bg-white p-8 rounded shadow-md flex w-4/5 max-w-4xl">
        <div className="w-1/2 flex justify-center items-center">
          <img src={LoginImage} alt="Login" className="w-3/4" />
        </div>
        <div className="w-1/2 p-6">
          <div className="flex justify-center mb-6">
            <img src={Logo} alt="Logo" />
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
                className="w-full px-3 py-2 border rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                className="w-full px-3 py-2 border rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Masukkan Password"
              />
            </div>
            {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full h-12 text-white font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-lg hover:scale-105 duration-200 hover:drop-shadow-2xl hover:shadow-[#7dd3fc] hover:cursor-pointer"
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
