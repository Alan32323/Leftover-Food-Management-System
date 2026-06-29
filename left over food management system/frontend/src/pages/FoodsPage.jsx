import React, { useState, useEffect } from "react";
import axios from "axios";
import foodBg from "../assets/food-bg.png"
const FoodsPage = () => {
  const [foods, setFoods] = useState([]);

  // 🟢 FETCH ALL FOODS
  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/foods");
      setFoods(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 🟢 DELETE FOOD (ADMIN CONTROL)
  const deleteFood = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/foods/${id}`);
      setFoods(foods.filter((food) => food._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
   <div
     className="min-h-screen p-6 bg-cover bg-center"
     style={{
       backgroundImage: ` url(${foodBg})`,
     }}
   >

      <h1 className="text-3xl font-bold mb-6 text-center">
        🍛 All Food Posts
      </h1>

      {/* 🟢 FOOD CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {foods.map((food) => (
          <div
            key={food._id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg"
          >

            <h2 className="text-xl font-bold">
              🍛 {food.foodName}
            </h2>

            <p>Type: {food.foodType}</p>

            <p>
              Quantity: {food.quantity} {food.unit}
            </p>

            <p>Remaining: {food.remainingQuantity}</p>

            <p>Provider: {food.providerName}</p>

            <p>Provider Type: {food.providerType}</p>

            <p>📍 {food.location}</p>

            <p>📞 {food.contactNo}</p>

            <p>
              ⏰ Expires:{" "}
              {new Date(food.expiryTime).toLocaleString()}
            </p>

            {/* 🟢 STATUS */}
            <p
              className={`font-bold mt-2 ${
                food.status === "available"
                  ? "text-green-600"
                  : food.status === "requested"
                  ? "text-yellow-600"
                  : food.status === "delivered"
                  ? "text-blue-600"
                  : food.status === "expired"
                  ? "text-red-600"
                  : food.status === "unavailable"
                  ? "text-gray-600"
                  : "text-black"
              }`}
            >
              Status: {food.status}
            </p>

            {/* 🟢 REQUEST INFO */}
            {food.status === "requested" && (
              <div className="mt-3 border-t pt-3">

                <p className="font-semibold">
                  Requested By: {food.requestedBy}
                </p>

                <p>
                  Requested Quantity: {food.requestedQuantity}
                </p>

              </div>
            )}

            {/* 🟢 DELIVERY INFO */}
            {food.status === "delivered" && (
              <p className="text-blue-600 font-semibold mt-2">
                ✅ Delivered Successfully
              </p>
            )}

            {/* 🟢 EXPIRED INFO */}
            {food.status === "expired" && (
              <p className="text-red-600 font-semibold mt-2">
                ❌ Expired Food
              </p>
            )}

            {/* 🟢 LOCATION LINK */}
            {food.googleMapLink && (
              <a
                href={food.googleMapLink}
                target="_blank"
                rel="noreferrer"
                className="block mt-3 text-blue-600 underline"
              >
                View Location
              </a>
            )}

            {/* 🟢 DELETE BUTTON (ADMIN) */}
            <button
              onClick={() => deleteFood(food._id)}
              className="bg-red-600 text-white px-3 py-2 rounded mt-4 hover:bg-green-600 transition"
            >
              Delete Food
            </button>

          </div>
        ))}

      </div>
    </div>
  );
};
export default FoodsPage;






















