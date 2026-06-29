import React, { useEffect, useState } from "react";
import axios from "axios";
import QRCode from "react-qr-code";
import { toast } from "react-toastify";
import foodBg from "../assets/food-bg.png"

const Foods = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [foods, setFoods] = useState([]);
  const [foodSearch, setFoodSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/foods"
      );

      setFoods(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load foods");
    }
  };

  const isExpired = (food) => {
    return new Date(food.expiryTime) < new Date();
  };

  const getFoodStatus = (food) => {
    if (isExpired(food)) return "expired";
    if (food.remainingQuantity <= 0) return "unavailable";
    return "available";
  };

const isRequestDisabled = (food) => {
  const myRequest = food.requests?.find(
    (request) =>
      request.userId === user?._id &&
      request.status === "requested"
  );

  return (
    food.remainingQuantity <= 0 ||
    isExpired(food) ||
    myRequest
  );
};

  const requestFood = async (food) => {
    if (isRequestDisabled(food)) {
      toast.error("Food is unavailable");
      return;
    }

    const quantity = prompt(
      `Enter quantity (Max: ${food.remainingQuantity})`
    );

    if (!quantity) return;

    const requestedQuantity = Number(quantity);

    if (
      isNaN(requestedQuantity) ||
      requestedQuantity <= 0 ||
      requestedQuantity > food.remainingQuantity
    ) {
      toast.error("Invalid quantity");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:3000/api/foods/request/${food._id}`,
        {
          userId:user._id,
          userName:user.name,
          requestedQuantity

        }
      );

      setFoods((prevFoods) =>
        prevFoods.map((item) =>
          item._id === food._id ? res.data : item
        )
      );

      toast.success("Food requested successfully");
    } catch (err) {
      console.log(err);
      toast.error("Request failed");
    }
  };

  const filteredFoods = foods.filter((food) => {
    const matchesFoodName = food.foodName
      ?.toLowerCase()
      .includes(foodSearch.toLowerCase());

    const matchesLocation = food.location
      ?.toLowerCase()
      .includes(locationSearch.toLowerCase());

    const currentStatus = getFoodStatus(food);

    const matchesStatus =
      statusFilter === "all" ||
      currentStatus === statusFilter;

    return (
      matchesFoodName &&
      matchesLocation &&
      matchesStatus
    );
  });

  return (
     <div
                 className="min-h-screen p-6 bg-cover bg-center"
                 style={{
                   backgroundImage: ` url(${foodBg})`,
                 }}
               >
      <h1 className="text-3xl font-bold mb-6">
        Welcome, {user?.name || "User"} 👋
      </h1>

      {/* Filters */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <input 
          type="text"
          placeholder="Search by food name"
          value={foodSearch}
          onChange={(e) =>
            setFoodSearch(e.target.value)
          }
          className="border p-3 rounded-lg"
        />

        <input
          type="text"
          placeholder="Search by location"
          value={locationSearch}
          onChange={(e) =>
            setLocationSearch(e.target.value)
          }
          className="border p-3 rounded-lg"
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="border p-3 rounded-lg"
        >
          <option value="all">All Status</option>
          <option value="available">
            Available
          </option>
          <option value="unavailable">
            Unavailable
          </option>
          <option value="expired">
            Expired
          </option>
        </select>
      </div>

      {/* Food Cards */}

      {filteredFoods.length === 0 ? (
        <div className="text-center text-gray-600 text-xl">
          No food posts found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredFoods.map((food) => {
            const currentStatus =
              getFoodStatus(food);

              const myRequest = food.requests?.find(
  (request) => request.userId === user?._id
);

            return (
              <div
                key={food._id}
                className="bg-white p-5 rounded-xl shadow hover:shadow-lg"
              >
                <h2 className="text-2xl font-bold mb-3">
                  🍛 {food.foodName}
                </h2>

                <p>
                  <strong>Food Type:</strong>{" "}
                  {food.foodType}
                </p>

                <p>
                  <strong>Available Quantity:</strong>{" "}
                  {food.remainingQuantity}{" "}
                  {food.unit}
                </p>

                <p>
                  <strong>Provider:</strong>{" "}
                  {food.providerName}
                </p>

                <p>
                  <strong>Provider Type:</strong>{" "}
                  {food.providerType}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {food.location}
                </p>

                <p>
                  <strong>Contact:</strong>{" "}
                  {food.contactNo}
                </p>

                <p>
                  <strong>Expires:</strong>{" "}
                  {new Date(
                    food.expiryTime
                  ).toLocaleString()}
                </p>

                <p
                  className={`font-semibold mt-3 ${
                    currentStatus ===
                    "available"
                      ? "text-green-600"
                      : currentStatus ===
                        "unavailable"
                      ? "text-gray-600"
                      : "text-red-600"
                  }`}
                >

                  {currentStatus ===
                    "available" &&
                    "🟢 Available"}

                  {currentStatus ===
                    "unavailable" &&
                    "⚫ Unavailable"}

                  {currentStatus ===
                    "expired" &&
                    "❌ Expired"}
                </p>

                {food.googleMapLink && (
                  <a
                    href={food.googleMapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="block mt-3 text-blue-600 hover:underline"
                  >
                    📍 View Location
                  </a>
                )}

                <button
                  disabled={isRequestDisabled(
                    food
                  )}
                  onClick={() =>
                    requestFood(food)
                  }
                  className={`w-full mt-4 py-2 rounded text-white ${
                    isRequestDisabled(food)
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  Request Food
                </button>
 {myRequest && (
  <p>
    Request Status: {myRequest.status}
  </p>
 )}

              {myRequest?.status === "requested"&& (
                  <div className="mt-5 border-t pt-4 flex flex-col items-center">
                    <h3 className="font-semibold mb-3">
                      Pickup QR Code
                    </h3>

                   <QRCode
  value={JSON.stringify({
    foodId: food._id,
    requestId: myRequest._id,
    userId: myRequest.userId,
    requestedQuantity: myRequest.requestedQuantity,
  })}
  size={140}
/>

                    <p className="text-sm text-gray-600 mt-3 text-center">
                      Show this QR code to
                      the provider during
                      pickup
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Foods;