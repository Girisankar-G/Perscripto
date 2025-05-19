import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";   // <-- correct import here
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import axios from "axios";
import { toast } from "react-toastify";


const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);

  const navigate=useNavigate()

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const url =
        state === "Admin"
          ? `${backendUrl}/api/admin/login`
          : `${backendUrl}/api/doctor/login`;

      const { data } = await axios.post(url, { email, password });

      // Log response data for debugging
      console.log("Response Data:", data);

      if (data.success) {
        if (state === "Admin") {
          console.log("Admin token:", data.token);
          localStorage.setItem("atoken", data.token);
          setAToken(data.token);
        } else if (state === "Doctor") {
          console.log("Doctor token:", data.token);
          localStorage.setItem("dToken", data.token);
          setDToken(data.token);
        }

        toast.success(`${state} login successful`);
      } else {
        console.log(data.message);  // Log error message from backend
        toast.error(data.message || `${state} login failed`);
      }
    } catch (error) {
      console.error(`${state} login failed:`, error);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-[#5f6fff]">{state}</span> Login
        </p>
        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            required
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="password"
            required
          />
        </div>
        <button className="bg-[#5f6fff] text-white w-full py-2 rounded-md text-base cursor-pointer">
          Login
        </button>
        {state === "Admin" ? (
          <p>
            Doctor Login?{" "}
            <span
              className="text-[#5f6fff] underline cursor-pointer"
              onClick={() => setState("Doctor")}
            >
              Click Here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?{" "}
            <span
              className="text-[#5f6fff] underline cursor-pointer"
              onClick={() => setState("Admin")}
            >
              Click Here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;

