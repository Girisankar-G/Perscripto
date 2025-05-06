import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "");
  const [appointments, setAppointments] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dashData,setDashData]=useState(false)
  const [profileData,setprofileData]=useState(false)

  useEffect(() => {
    localStorage.setItem("dToken", dToken);
  }, [dToken]);

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/appointments`,
        {
          headers: { Authorization: `Bearer ${dToken}` },
        }
      );

      if (data.success) {
        const fetchedAppointments = [...(data.appointments || [])];
        if (fetchedAppointments.length === 0) {
          toast.info("No appointments found.");
        }
        setAppointments(fetchedAppointments);
      } else {
        toast.error(data.message || "Failed to load appointments");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching appointments");
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/complete-appointment`,
        { appointmentId },
        {
          headers: {
            Authorization: `Bearer ${dToken}`,
          },
        }
      );
      if (data.success) toast.success(data.message);
      else toast.error(data.message);
      return data;
    } catch (error) {
      toast.error(error.message);
      return { success: false };
    }
  };
  
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/cancel-appointment`,
        { appointmentId },
        {
          headers: {
            Authorization: `Bearer ${dToken}`,
          },
        }
      );
      if (data.success) toast.success(data.message);
      else toast.error(data.message);
      return data;
    } catch (error) {
      toast.error(error.message);
      return { success: false };
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/dashboard`,
        {
          headers: { Authorization: `Bearer ${dToken}` },
        }
      );

      if (data.success) {
        setDashData(data.dashData);
        console.log(data.dashData)
      } else {
        toast.error(data.message || "Failed to load appointments");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching appointments");
    }
  }

  const getProfileData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/profile`,
        {
          headers: { Authorization: `Bearer ${dToken}` },
        }
      );

      if (data.success) {
        setprofileData(data.profileData);
        console.log(data.profileData)
      } else {
        toast.error(data.message || "Failed to load appointments");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching appointments");
    }
  }

  

  return (
    <DoctorContext.Provider
      value={{
        dToken,
        setDToken,
        backendUrl,
        appointments,
        getAppointments,
        completeAppointment,
        cancelAppointment,
        getDashData,
        dashData,
        profileData,
        setprofileData,
        getProfileData
      }}
    >
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
