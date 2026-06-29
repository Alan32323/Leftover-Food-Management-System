import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import foodBg from "../assets/food-bg.png"
const Login = () => {
  const navigate=useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      "http://localhost:3000/auth/login",
      form
    );

    toast.success("Login Successful");

    const user = res.data.user;
    const token = res.data.token;

    sessionStorage.setItem("token", token);
    sessionStorage.setItem("user", JSON.stringify(user));
    

    if (user.role === "admin") {
      navigate("/AdminDashboard");
    } else if (user.role === "provider") {
      navigate("/ProviderDashboard");
    } else {
      navigate("/Foods");
    }

  } catch (error) {
    toast.error(
       "Login Failed"
    );
  }
};

  return (
 <div
   className="min-h-screen flex flex-col items-center justify-center px-4 bg-cover bg-center"
   style={{
     backgroundImage: ` url(${foodBg})`,
   }}
 >

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-80"
      >
        <h1 className="text-2xl font-bold text-center mb-4">
          Login
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-green-600 transition"
        >
          Login
        </button>
      </form>

    </div>
  );
};

export default Login;
