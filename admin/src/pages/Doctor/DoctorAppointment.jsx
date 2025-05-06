import React, { useEffect, useContext, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets.js";

const DoctorAppointment = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);
  const { calculateAge, slotDateFormat } = useContext(AppContext);

  // Local state to manage immediate status update
  const [localStatus, setLocalStatus] = useState({});

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  const handleAction = async (type, appointmentId) => {
    setLocalStatus((prev) => ({ ...prev, [appointmentId]: type }));

    if (type === "accepted") {
      await completeAppointment(appointmentId);
    } else if (type === "cancelled") {
      await cancelAppointment(appointmentId);
    }
  };

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-4 text-2xl font-semibold text-blue-800">
        All Appointments
      </p>

      <div className="bg-white px-2 py-2 shadow-xl rounded-xl overflow-hidden max-h-[80vh] overflow-y-scroll scrollbar-hide">
        {/* Table Header */}
        <div className="grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr] gap-4 py-4 px-6 bg-blue-100 font-medium text-gray-700">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {/* Appointments List */}
        <div>
          {appointments.reverse().map((item, index) => {
            const status = localStatus[item._id] || item.status;

            return (
              <div
                key={index}
                className={`grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr] items-center px-6 py-4 mb-4 ${
                  status === "accepted"
                    ? "bg-green-50"
                    : status === "cancelled"
                    ? "bg-red-50"
                    : "hover:bg-gray-50"
                } shadow-md rounded-lg`}
              >
                <p>{index + 1}</p>

                <div className="flex items-center mr-4 flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <img
                    src={item.userData.image}
                    alt="patient"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="text-center sm:text-left">
                    <p>{item.userData.name}</p>
                    <p className="text-sm text-gray-500">
                      {slotDateFormat(item.slotDate)}
                    </p>
                  </div>
                </div>

                <span className="text-xs ml-3 w-[60px] font-medium border border-gray-400 rounded-full px-3 py-1 text-gray-700">
                  {item.payment ? "Online" : "CASH"}
                </span>

                <p className="ml-4">{calculateAge(item.userData.dob)}</p>

                <p className="ml-6">{item.slotTime}</p>

                <p className="ml-2">₹ {item.amount}</p>

                {/* Action buttons or status text */}
                <div className="flex space-x-2 justify-center">
                  {item.cancelled ? (
                    <p className="text-red-600 font-semibold">Cancelled</p>
                  ) : item.isCompleted ? (
                    <p className="text-green-600 font-semibold">Accepted</p>
                  ) : (
                    <>
                      <img
                        onClick={() => handleAction("cancelled", item._id)}
                        src={assets.cancel_icon}
                        alt="Cancel"
                        className="w-10 h-10 cursor-pointer transition duration-300 transform hover:scale-115"
                      />
                      <img
                        onClick={() => handleAction("accepted", item._id)}
                        src={assets.tick_icon}
                        alt="Accept"
                        className="w-10 h-10 cursor-pointer transition duration-300 transform hover:scale-115"
                      />
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointment;
