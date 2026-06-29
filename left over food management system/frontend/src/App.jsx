import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Foods from "./pages/Foods";
import AdminDashboard from "./pages/AdminDashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UsersPage from "./pages/UsersPage";
import ProvidersPage from "./pages/ProvidersPage";
import Navbar from "./components/Navbar";
import FoodsPage from "./pages/FoodsPage";
import AdminRequests from "./pages/AdminRequests"
function App() {
  return (  
    <>
    <BrowserRouter>
     <Navbar/>
    <ToastContainer position="top-center" />
      <Routes>
              
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Foods" element={<Foods />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/ProviderDashboard" element={<ProviderDashboard/>} />
        <Route path="/admin/users" element={<UsersPage/>}/>
        <Route path="/admin/providers" element={<ProvidersPage/>}/>
        <Route path="/admin/foods" element={<FoodsPage/>}/>
        <Route path="/admin/requests" element={<AdminRequests/>}/>

      </Routes>
    </BrowserRouter>
          </>
  );
}

export default App;


