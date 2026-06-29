import React, { useState } from "react";
import axios from "axios";
import {useEffect} from "react";
import { toast } from "react-toastify";
import { Html5QrcodeScanner } from "html5-qrcode";
import foodBg from "../assets/food-bg.png"

const ProviderDashboard = () => {
  const user=JSON.parse(sessionStorage.getItem("user"));
  const providerId=user?._id
  const providerName=user?.name
  const [foods, setFoods] = useState([]);
const [showScanner, setShowScanner] = useState(false);
  const [form, setForm] = useState({
    foodName: "",
    foodType: "",
    quantity: "",
    unit:"",
    providerName:"",
    providerType:"",
    location: "",
    contactNumber: "",
    googleMapLink: "",
    expiryTime: "",
  });

   useEffect(() => {
  axios
    .get(`http://localhost:3000/api/foods/provider/${providerId}`)
    .then((res) => {
      setFoods(res.data);

      // 🔥 check expiry for each food
      res.data.forEach((food) => {
        axios.put(
          `http://localhost:3000/api/foods/check-expiry/${food._id}`
        );
      });
    })
    .catch((err) => console.log(err));
}, [providerId])
  useEffect(() => {
  if (!showScanner) return;

  const scanner = new Html5QrcodeScanner(
    "reader",
    {
      fps: 10,
      qrbox: 350,
    },
    true
  );

scanner.render(
  async (decodedText) => {
    try {
      const data = JSON.parse(decodedText);

      await markDelivered(
        data.foodId,
        data.requestId
      );

      setShowScanner(false);

      try {
        await scanner.clear();
      } catch (clearError) {
        console.log(clearError);
      }

    } catch (err) {
      console.log(err);
      toast.error("Invalid QR code");
    }
  },
  () => {}
);

  return () => {
    scanner.clear().catch(() => {});
  };
}, [showScanner]);

  const addFood = () => {
    if (
      !form.foodName ||
      !form.foodType ||
      !form.quantity ||
      !form.providerType||
      !form.providerName||
      !form.location ||
      !form.contactNumber||
      !form.expiryTime
     
    ) {
      toast.success("Please fill all required fields");
      return;
    }

    const now = new Date();
    const expiry = new Date(form.expiryTime);

    const newFood = {
      
      foodName: form.foodName,
      foodType: form.foodType,
      quantity: Number(form.quantity),
      unit:form.unit,
      remainingQuantity: Number(form.quantity),
      providerId:providerId,
      providerType:form.providerType,
      providerName:form.providerName,
      location: form.location,
      contactNo: form.contactNumber,
      googleMapLink: form.googleMapLink,
      expiryTime: form.expiryTime,
      status: expiry < now ? "expired" : "available",
      requests:[]
    };

axios
  .post("http://localhost:3000/api/foods", {
    ...newFood,
    providerId,
  })
  .then((res) => {
    setFoods([...foods, res.data]);
    toast.success("Food Added Successfully!");
  })
  .catch((err)=>{
    toast.error("Failed to add food");
  });

  
    setForm({
      foodName: "",
      foodType: "",
      quantity: "",
      unit:"",
      providerName:"",
      providerType:"",
      location: "",
      contactNumber: "",
      googleMapLink: "",
      expiryTime: "",
    });
  };

  const deleteFood = (id) => {
  axios
    .delete(`http://localhost:3000/api/foods/${id}`)
    .then(() => {
      setFoods(foods.filter((food) => food._id !== id));
    });
}

const markDelivered = (foodId, requestId) => {
  axios
    .put(`
      http://localhost:3000/api/foods/${foodId}/requests/${requestId}/deliver`
    )
    .then((res) => {
      setFoods((prevFoods) =>
        prevFoods.map((food) =>
          food._id === foodId ? res.data : food
        )
      );

      toast.success("Request marked as delivered");
    })
    .catch((err) => {
      console.log(err);
      toast.error("Failed to update request");
    });
};


const allRequests = foods.flatMap((food) =>
  (food.requests || []).map((request) => ({
    ...request,
    requestId:request._id,
    foodId: food._id,
    foodName: food.foodName,
    unit: food.unit,
    location: food.location,
  }))
);

  return (
    <div
             className="min-h-screen p-6 bg-cover bg-center"
             style={{
               backgroundImage: ` url(${foodBg})`,
             }}
           >
      <h1 className="text-3xl font-bold mb-6">
        🏪 Provider Dashboard
      </h1>
      
<h2 className="text-xl font-semibold text-green-600 mb-6">
  👋 Welcome, {providerName} 
</h2>

      <div className="bg-white p-6 rounded-xl shadow mb-8">

        <h2 className="text-xl font-semibold mb-4">
          Add Food
        </h2>

        <div className="grid grid-cols-1 gap-3">

          <input
            type="text"
            placeholder="Food Name"
            value={form.foodName}
            onChange={(e) =>
              setForm({
                ...form,
                foodName: e.target.value,
              })
            }
            className="border p-2 rounded"
          />

          <input
            type="text"
            placeholder="Food Type"
            value={form.foodType}
            onChange={(e) =>
              setForm({
                ...form,
                foodType: e.target.value,
              })
            }
            className="border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) =>
              setForm({
                ...form,
                quantity: e.target.value,
              })
            }
            className="border p-2 rounded"
          />


  <input
  type="text"
  placeholder="Units (Kg, Plates, Packets)"
  value={form.unit}
  onChange={(e) =>
    setForm({
      ...form,
      unit: e.target.value,
    })
  }
  className="border p-2 rounded"
  />

  <input
            type="text"
            placeholder="providerName"
            value={form.providerName}
            onChange={(e) =>
              setForm({
                ...form,
                providerName: e.target.value,
              })
            }
            className="border p-2 rounded"
          />



<input
            type="text"
            placeholder="providerType"
            value={form.providerType}
            onChange={(e) =>
              setForm({
                ...form,
                providerType: e.target.value,
              })
            }
            className="border p-2 rounded"
          />

          <input
            type="text"
            placeholder="Location"
            value={form.location}
            onChange={(e) =>
              setForm({
                ...form,
                location: e.target.value,
              })
            }
            className="border p-2 rounded"
          />

          <input
            type="tel"
            placeholder="Contact Number"
            value={form.contactNumber}
            onChange={(e) =>
              setForm({
                ...form,
                contactNumber: e.target.value,
              })
            }
            className="border p-2 rounded"
          />

          <input
            type="text"
            placeholder="Google Map Link"
            value={form.googleMapLink}
            onChange={(e) =>
              setForm({
                ...form,
                googleMapLink: e.target.value,
              })
            }

            className="border p-2 rounded"
          />

          <input
            type="datetime-local"
            value={form.expiryTime}
            onChange={(e) =>
              setForm({
                ...form,
                expiryTime: e.target.value,
              })
            }
            className="border p-2 rounded"
          />

          <button
            onClick={addFood}
            className="bg-green-600 text-white py-2 rounded hover:bg-orange-600 transition"
          >
            Add Food
          </button>

        </div>

      </div>

      <h2 className="text-2xl font-semibold mb-4">
        My Food Posts
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {foods.map((food) => (

          <div
            key={food._id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg"
          >

            <h2 className="text-xl font-bold">
              🍛 {food.foodName}
            </h2>

            <p>Food Type: {food.foodType}</p>

            <p>Quantity: {food.quantity}{food.unit}</p>

            <p>Remaining Quantity: {food.remainingQuantity}</p>

            <p>📍 {food.location}</p>

            <p> Provided By:{food.providerType}: {food.providerName}</p>

            <p>📞 {food.contactNo}</p>

            <p>
              ⏰ Expires At:{" "}
              {new Date(food.expiryTime).toLocaleString()}
            </p>

            <p
  className={`font-semibold mt-2 ${
    food.status === "available"
      ? "text-green-600"
   
     
      : food.status === "unavailable"
      ? "text-gray-600"
      : food.status === "expired"
      ? "text-red-600"
      : "text-black"
  }`}
>
              Status: {food.status}
            </p>
 {food.status === "available" && (
              <div className="mt-3">

                <p className="text-gray-600 font-semibold">
                  🟢 Available
                </p>

              </div>
            )}

            {food.status === "unavailable" && (
              <div className="mt-3">

                <p className="text-gray-600 font-semibold">
                  ⚫ No Quantity Remaining
                </p>

              </div>
            )}

            {food.status === "expired" && (
              <div className="mt-3">

                <p className="text-red-600 font-semibold">
                  ❌ Food Expired
                </p>

              </div>
            )}




            {food.googleMapLink && (
              <a
                href={food.googleMapLink}
                target="_blank"
                rel="noreferrer"
                className="block mt-3 text-blue-600"
              >
                View Location
              </a>
            )}

            <button
              onClick={() =>
                deleteFood(food._id)
              }
              className="bg-red-600 text-white px-3 py-2 rounded mt-4 hover:bg-green-600 transition"
            >
              Delete Food
            </button>

          </div>

        ))}

      </div>


<button
  onClick={() => setShowScanner(true)}
  className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-red-600"
>
  📷 Scan Pickup QR
</button>

{showScanner && (
  <div className="bg-white p-4 rounded-xl shadow mb-6">
    <h3 className="font-semibold mb-4">
      Scan User QR Code
    </h3>

    <div id="reader"></div>
  </div>
)}


      <h2 className="text-2xl font-semibold mt-10 mb-4">
  📨 Requests Received
</h2>

{allRequests.length === 0 ? (
  <p className="text-gray-500">
    No requests received yet.
  </p>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {allRequests.map((request) => (
      <div
        key={request._id}
        className="bg-white p-4 rounded-xl shadow"
      >
        <h3 className="text-lg font-bold mb-2">
          🍛 {request.foodName}
        </h3>

        <p>
          👤 <strong>User:</strong>{" "}
          {request.userName}
        </p>

        <p>
          📦 <strong>Quantity:</strong>{" "}
          {request.requestedQuantity}{" "}
          {request.unit}
        </p>

        <p>
          📍 <strong>Pickup Location:</strong>{" "}
          {request.location}
        </p>

        <p>


          🕒 <strong>Requested At:</strong>{" "}
          {new Date(
            request.requestedAt
          ).toLocaleString()}
        </p>

        <p>
          📌 <strong>Status:</strong>{" "}
          {request.status}
        </p>


{request.status === "delivered" && (
  <p className="text-green-600 font-semibold">
    ✅ Delivered
  </p>
)}

{request.status === "expired" && (
  <p className="text-red-600 font-semibold">
    ❌ Food Expired
  </p>
)}
{request.status === "requested" && (
  <button
    onClick={() =>
      markDelivered(
        request.foodId,
        request.requestId
      )
    }
     className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-red-600"
  >
    Mark Delivered
  </button>
)}
        

      </div>
    ))}
  </div>
)}


    </div>
  );
};


export default ProviderDashboard;