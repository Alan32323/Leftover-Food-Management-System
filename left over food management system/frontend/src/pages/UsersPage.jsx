import React, { useEffect, useState } from "react";
import axios from "axios";
import foodBg from "../assets/food-bg.png"
const UsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/admin/users");
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
            className="min-h-screen p-6 bg-cover bg-center"
            style={{
              backgroundImage: ` url(${foodBg})`,
            }}
          >

      <h1 className="text-3xl font-bold mb-6">
        🏪 Users
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg"
          >


<h2 className="text-blue-600 text-xl font-bold">
              {user.userType}
            </h2>

            <h2 className="text-xl font-semibold">
              {user.name}
            </h2>

            <p className="text-gray-600 mt-1">
              📧 {user.email}
            </p>

         
            <p className="mt-2 text-green-600 font-semibold">
              👤 User
            </p>

          </div>
        ))}

      </div>

    </div>
  );
};

export default UsersPage;

