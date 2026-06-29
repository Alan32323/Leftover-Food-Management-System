import React, { useState ,useEffect} from "react";
import logo from "../assets/logo.png";
import {useNavigate,useLocation} from "react-router-dom";
const Navbar = () => {
  const [open, setOpen] = useState(false);
  
const location=useLocation();
const navigate=useNavigate();
const [user, setUser] = useState(
  sessionStorage.getItem("user")
);

useEffect(() => {
  setUser(sessionStorage.getItem("user"));
}, [location]);

  const handleLogout = () => {
    sessionStorage.clear(); 
    setUser(null);// or removeItem("user")
     navigate("/"); // Redirect to home page
  };

  return (
    <div className="bg-white shadow-md px-6 py-3 flex justify-end items-center">

      {/* SMALL CIRCLE LOGO */}
      <img
        src={logo}
        alt="Logo"
        onClick={() => setOpen(true)}
        className="h-10 w-10 rounded-full cursor-pointer border-2 border-gray-300"
      />

{user && (
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      )}


      {/* POPUP */}
      {open && (
        <div
          className="fixed inset-0 bg-white bg-opacity-60 flex items-center justify-center"
          onClick={() => setOpen(false)}
        >
          <img
            src={logo}
            alt="Logo Big"
            className="h-64 w-64 rounded-xl shadow-2xl"
          />
        </div>
      )}

    </div>
  );
};

export default Navbar;