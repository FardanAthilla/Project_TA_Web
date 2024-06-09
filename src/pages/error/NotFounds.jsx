import React, { useEffect } from "react";
import Parallax from "parallax-js";
import { Link } from "react-router-dom";
import Logo from "../../assets/image/logo3.png";

const NotFound = () => {
  useEffect(() => {
    const scene = document.getElementById("scene");
    new Parallax(scene);
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-b from-black to-[#0D99FF] text-white overflow-hidden">
      <div className="relative w-full h-full text-center overflow-hidden flex items-center justify-center">
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

          {/* Astronaut for parallax effect */}
          <div className="absolute mt-5 w-100 h-1000 md:w-60 md:h-60 transform transition-transform duration-300 ease-in-out hover:rotate-6 hover:scale-105 glow-astronaut">
            <img src={Logo} alt="Astronaut" />
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
                  transform: "rotate(45deg) translate(-50%, -50%)",
                }}
              ></div>
            ))}
          </div>

          {/* 404 Text */}
          <div className="absolute inset-0 flex items-center justify-center mt-20 md:mt-32">
            <p
              className="text-7xl md:text-9xl font-bold text-white glow-text bounce-animation"
              data-depth="0.30"
            >
              404
            </p>
          </div>
        </div>

        <div className="relative z-10 text-center px-4">
          <article className="space-y-4 mt-12 md:mt-16">
            <p className="text-lg md:text-2xl glow-text">
              Tidak! Seperti nya kamu terjebak di luar angkasa.
              <br />
              kembali ke halaman Dashboard
            </p>
            <Link to="/">
              <button className="mt-9 w-64 h-12 text-white font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-lg hover:scale-105 duration-200 hover:drop-shadow-2xl hover:shadow-[#7dd3fc] hover:cursor-pointer">
                Paham!
              </button>
            </Link>
          </article>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
