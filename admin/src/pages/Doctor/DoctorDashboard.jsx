import { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const DoctorDashboard = () => {
  const { dToken, dashData, getDashData, cancelAppointment } =
    useContext(DoctorContext);
  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);

  if (!dashData) return null;

  return (
    <div className="w-full max-w-6xl mt-8 px-4">
      <p className="text-2xl font-bold text-blue-800 mb-6">Dashboard</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10 max-w-4xl">
        <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-4 hover:shadow-xl transition-shadow w-full">
          <img
            src={assets.appointment_icon}
            alt="Appointments"
            className=" w-12 h-12"
          />
          <div>
            <p className="text-lg font-semibold text-gray-700">Appointments</p>
            <p className="text-2xl font-bold text-blue-600">
              {dashData.appointments}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-4 hover:shadow-xl transition-shadow w-full">
          <img src={assets.patients_icon} alt="Patients" className="w-12 h-12" />
          <div>
            <p className="text-lg font-semibold text-gray-700">Patients</p>
            <p className="text-2xl font-bold text-blue-600">
              {dashData.patients}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-4 hover:shadow-xl transition-shadow w-full">
          <img
            src={assets.earning_icon}
            alt="Earnings"
            className="w-12 h-12"
          />
          <div>
            <p className="text-lg font-semibold text-gray-700">Earnings</p>
            <p className="text-2xl font-bold text-green-600">
              ₹ {dashData.earnings}
            </p>
          </div>
        </div>
      </div>

      {/* Latest Appointments */}
      <div className="bg-white px-2 shadow-xl rounded-xl max-h-[70vh] overflow-y-scroll scrollbar-hide max-w-4xl">
        <p className="text-xl font-semibold text-blue-700 px-6 pt-4 flex items-center gap-2">
          <img src={assets.list_icon} alt="list" className="w-6 h-6" />
          Latest Bookings
        </p>

        <div className="grid grid-cols-[2fr_2fr_1fr] gap-4 py-4 px-6 bg-blue-100 font-medium text-gray-700 mt-2">
          <p>Patient</p>
          <p>Date</p>
          <p className="text-end">Action</p>
        </div>

        {dashData.latestAppointments.map((item, index) => (
          <div
            key={index}
            className={`grid grid-cols-[2fr_2fr_1fr] gap-4 items-center text-gray-600 py-4 px-6 my-3 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
              item.cancelled ? "bg-red-50" : "bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src={item.userData.image}
                alt="Patient"
                className="w-10 h-10 rounded-full object-cover border"
              />
              <div className="flex flex-col">
                <p className="font-semibold">{item.userData.name}</p>
                <p
                  className={`text-sm ${
                    item.cancelled
                      ? "line-through text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  {slotDateFormat(item.slotDate)}
                </p>
              </div>
            </div>

            <p>{item.slotTime}</p>

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

export default DoctorDashboard;
