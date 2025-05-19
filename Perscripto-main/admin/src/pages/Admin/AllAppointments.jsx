import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets.js";

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } =
    useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  return (
    <div className="w-full max-w-6xl mt-8 px-4">
      <p className="text-2xl font-bold text-blue-800 mb-6">All Appointments</p>

      <div className="bg-white px-2 shadow-xl rounded-xl max-h-[80vh] overflow-y-scroll scrollbar-hide max-w-4xl">
        <p className="text-xl font-semibold text-blue-700 px-6 pt-4 flex items-center gap-2">
          <img src={assets.list_icon} alt="list" className="w-6 h-6" />
          Appointment List
        </p>

        {/* Column Headers */}
        <div className="grid grid-cols-[2fr_2fr_1fr] gap-4 py-4 px-6 bg-blue-100 font-medium text-gray-700 mt-2">
          <p>Patient & Doctor</p>
          <p>Date & Time</p>
          <p className="text-end">Action</p>
        </div>

        {appointments.map((item, index) => (
          <div
            key={index}
            className={`grid grid-cols-[2fr_2fr_1fr] gap-4 items-center text-gray-600 py-4 px-6 my-3 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
              item.cancelled ? "bg-red-50" : "bg-white"
            }`}
          >
            {/* Patient and Doctor Info */}
            <div className="flex items-center gap-3">
              <img
                src={item.userData.image}
                alt="User"
                className="w-10 h-10 rounded-full object-cover border"
              />
              <div className="flex flex-col">
                <p className="font-semibold">{item.userData.name}</p>
                <p className="text-sm text-gray-500">
                  with Dr. {item.docData.name}
                </p>
              </div>
            </div>

            {/* Date & Time */}
            <div className="text-sm">
              <p
                className={`${
                  item.cancelled
                    ? "line-through text-gray-400"
                    : "text-gray-600"
                }`}
              >
                {slotDateFormat(item.slotDate)}, {item.slotTime}
              </p>
            </div>

            {/* Action */}
            <div className="flex justify-end">
              {item.cancelled ? (
                <p className="text-red-500 font-semibold">Cancelled</p>
              ) : (
                <img
                  onClick={() => cancelAppointment(item._id)}
                  src={assets.cancel_icon}
                  alt="Cancel"
                  className="cursor-pointer w-8 h-8 hover:scale-110 transition-transform"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAppointments;
