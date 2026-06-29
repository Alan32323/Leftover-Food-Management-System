import React, {
  useEffect,
  useState,
} from "react";
import axios from "axios";
import foodBg from "../assets/food-bg.png"
const AdminRequests = () => {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/foods")
      .then((res) => setFoods(res.data))
      .catch((err) => console.log(err));
  }, []);

  const allRequests = foods.flatMap((food) =>
    (food.requests || []).map(
      (request) => ({
        ...request,
        foodId: food._id,
        foodName: food.foodName,
        providerName:
          food.providerName,
        providerType:
          food.providerType,
        unit: food.unit,
        location: food.location,
      })
    )
  );

  return (
    <div
         className="min-h-screen p-6 bg-cover bg-center"
         style={{
           backgroundImage: ` url(${foodBg})`,
         }}
       >
      <h1 className="text-3xl font-bold mb-6">
        📨 All Food Requests
      </h1>

      {allRequests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          {allRequests.map(
            (request) => (
              <div
                key={request._id}
                className="bg-white p-4 rounded-xl shadow"
              >
                <h2 className="text-xl font-bold mb-2">
                  🍛 {request.foodName}
                </h2>

                <p>
                  👤 User:{" "}
                  {request.userName}
                </p>

                <p>
                  🏪 Provider:{" "}
                {request.providerType} {" "} {request.providerName}
                </p>

               

                <p>
                  📦 Quantity:{" "}
                  {
                    request.requestedQuantity
                  }{" "}
                  {request.unit}
                </p>





                <p>
                  📍Pickup Location:{" "}
                  {request.location}
                </p>

<p
  className={`font-semibold ${
    request.status === "requested"
      ? "text-yellow-600"
      : request.status === "delivered"
      ? "text-green-600"
      : request.status === "expired"
      ? "text-red-600"
      : "text-black"
  }`}
>
  📌 Status: {request.status}
</p>

                <p>
                  🕒 Requested At:{" "}
                  {new Date(
                    request.requestedAt
                  ).toLocaleString()}
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default AdminRequests;