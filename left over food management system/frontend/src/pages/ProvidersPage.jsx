import React, { useEffect, useState } from "react";
import axios from "axios";

import foodBg from "../assets/food-bg.png"

const ProvidersPage = () => {
  const [providers, setProviders] = useState([]);
  

  useEffect(() => {
    fetchProviders();
  }, []);


  const fetchProviders = async () => {
    try {
      const res = await axios.get("http://localhost:3000/admin/providers");
      setProviders(res.data);
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
        🏪 Providers
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {providers.map((provider) => (
          <div
            key={provider._id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg"
          >


<h2 className="text-blue-600 text-xl font-bold">
              {provider.providerType}
            </h2>

            <h2 className="text-xl font-semibold">
              {provider.name}
            </h2>

            <p className="text-gray-600 mt-1">
              📧 {provider.email}
            </p>

         
            <p className="mt-2 text-green-600 font-semibold">
              🏪 Provider
            </p>

          </div>
        ))}

      </div>

    </div>
  );
};

export default ProvidersPage;


