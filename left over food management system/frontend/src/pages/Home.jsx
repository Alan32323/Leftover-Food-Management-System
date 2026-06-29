import React from 'react'

import { Link } from 'react-router-dom'
import foodBg from "../assets/food1.png"

const Home = () => {
  return (
   <div
  className="min-h-screen flex flex-col items-center justify-center px-4 bg-cover bg-center"
  style={{
    backgroundImage: ` url(${foodBg})`,
  }}
>

      {/* Title */}
      <h1 className="text-4xl font-bold text-red-600 text-center">
        Leftover Food Management System
      </h1>
    

      {/* Subtitle */}
      <p className=" text-2xl text-black-600 font-bold mt-3 text-center max-w-xl">
        Connect food providers and people in need to reduce food waste and help society.
      </p>         

      {/* Buttons */}
      <div className="mt-6 space-x-4">
        <Link
          to="/login"
          className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition"
        >
          Register
        </Link>
      </div>

    </div>
  );
};

export default Home;


