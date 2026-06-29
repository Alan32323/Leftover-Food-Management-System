import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import foodBg from "../assets/food-bg.png"
const Register = () => {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    userType:"",
    providerType:""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit =async (e) => {
    e.preventDefault();

    console.log(form);

    try{

    await axios.post(
  "http://localhost:3000/auth/register",
  form);

toast.success("Registration Successful");
    }
    catch(error)
    {
toast.error("Registration Failed");
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
        className="bg-white p-6 rounded-lg shadow-lg w-96"
      >

        <h1 className="text-2xl font-bold text-center mb-4">
          Register
        </h1>

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
          required
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
          required
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
          required
        />

        {/* Role */}
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        >
          <option value="user">User</option>
          <option value="provider">Provider</option>
        </select>


{form.role === "user" && (
  <select
    name="userType"
    value={form.userType}
    onChange={handleChange}
  >
    <option value="">Select User Type</option>
    <option value="NGO">NGO</option>
    <option value="Orphanage">Orphanage</option>
    <option value="Old Age Home">Old Age Home</option>
    <option value="Charity">Charity Organization</option>
  </select>
)}

{form.role === "provider" && (
  <select
    name="providerType"
    value={form.providerType}
    onChange={handleChange}
  >
    <option value="">Select Provider Type</option>
    <option value="Restaurant">Restaurant</option>
    <option value="Hotel">Hotel</option>
    <option value="Catering">Catering</option>
    <option value="Event Organizer">Event Organizer</option>
  </select>
)}


        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-green-600 transition"
        >
          Register
        </button>

      </form>

    </div>
  );
};

export default Register;

