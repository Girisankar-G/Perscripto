import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "₹";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );
  const [userData, setUserData] = useState(false);

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/get-profile`,
        { headers: { token } }
      );
  
      if (data.success) {
        setUserData(data.userData);  // Make sure to set userData correctly here
      } else {
        toast.error(data.message);
        // Optional: clear token if session expired
        setToken('');
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        toast.error("Session expired. Please log in again.");
        setToken('');
        localStorage.removeItem("token");
      } else {
        toast.error(error.message || "Failed to load user data.");
      }
    }
  };

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to fetch doctors");
    }
  };

  const value = {
    doctors,getDoctorsData,
    setDoctors,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token]);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
