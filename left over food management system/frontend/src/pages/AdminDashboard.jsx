import React ,{useState,useEffect}from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import foodBg from "../assets/food-bg.png"
const AdminDashboard = () => {
const navigate = useNavigate();

const [summary, setSummary] = useState({
  totalUsers: 0,
  totalProviders: 0,
});

const[foods,setFoods]=useState([])
const [posts,setPosts]=useState({
  available:0,
  requested:0,
  delivered:0,
  expired:0
});

useEffect(() => {
  fetchSummary();
  fetchFoods();
  fetchPosts()
}, []);



const fetchFoods = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/foods");
    setFoods(res.data);


  } catch (err) {
    console.log(err);
  }
};

const fetchSummary = async () => {
  const res = await axios.get("http://localhost:3000/admin/summary");
  setSummary(res.data);
};


const fetchPosts=async () =>
{
  const res=await axios.get("http://localhost:3000/admin/posts");
  setPosts(res.data);
}
return (
 <div
         className="min-h-screen p-6 bg-cover bg-center"
         style={{
           backgroundImage: ` url(${foodBg})`,
         }}
       >

  <h1 className="text-4xl font-bold text-center mb-10">
    Admin Dashboard
  </h1>

  {/* Summary Cards */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
      <h2 className="text-xl font-semibold">👤 Total Users</h2>
      <p className="text-4xl font-bold mt-3">{summary.totalUsers}</p>

      <button
        onClick={() => navigate("/admin/users")}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        View Users
      </button>
    </div>

    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
      <h2 className="text-xl font-semibold">🏪 Total Providers</h2>
      <p className="text-4xl font-bold mt-3">{summary.totalProviders}</p>

      <button
        onClick={() => navigate("/admin/providers")}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        View Providers
      </button>
    </div>

    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
      <h2 className="text-xl font-semibold">🍽️ Food Posts</h2>
      <p className="text-4xl font-bold mt-3">{foods.length}</p>

      <button
        onClick={() => navigate("/admin/foods")}
        className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        View Foods
      </button>
    </div>

  </div>

  {/* Additional Stats */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">

    <div className="bg-white p-5 rounded-xl shadow text-center">
      <h3>🟢 Available</h3>
      <p className="text-3xl font-bold">{posts.available}</p>
    </div>

    <div className="bg-white p-5 rounded-xl shadow text-center">
      <h3>🟡 Expired</h3>
      <p className="text-3xl font-bold">{posts.expired}</p>
    </div>

    <div className="bg-white p-5 rounded-xl shadow text-center">
      <h3>🔵 Delivered</h3>
      <p className="text-3xl font-bold">{posts.delivered}</p>
    </div>

    <div className="bg-white p-5 rounded-xl shadow text-center">
      <h3>📨 Requests</h3>
      <p className="text-3xl font-bold">{posts.requested}</p>
    </div>

  </div>


  <div className="bg-white rounded-xl shadow-lg p-6 text-center mt-8" >
  <h2 className="text-xl font-semibold">
    📨 Food Requests
  </h2>

 

  <button
    onClick={() => navigate("/admin/requests")}
    className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-700"
  >
    View Requests
  </button>
</div>



</div>

);
};

export default AdminDashboard;


