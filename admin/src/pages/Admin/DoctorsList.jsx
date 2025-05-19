import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext);
  const [allChecked, setAllChecked] = useState(true);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken, getAllDoctors]);

  // Handle individual toggle of availability for a doctor
  const handleToggleAvailability = (docId, currentAvailability) => {
    changeAvailability(docId, !currentAvailability, true);
    toast.success(
      currentAvailability ? "Doctor disabled" : "Doctor enabled"
    );
  };

  // Toggle all doctors availability
  const handleToggleAll = () => {
    doctors.forEach((doc) => {
      if (doc.available === allChecked) {
        changeAvailability(doc._id, !allChecked, false);
      }
    });

    toast.success(allChecked ? "All doctors disabled" : "All doctors enabled");
    setAllChecked(!allChecked);
  };

  return (
    <div className="m-5">
      <h1 className="text-lg font-medium mb-2">Doctors List</h1>

      {/* All toggle */}
      <div className="flex items-center mb-5 gap-2">
        <label className="text-[16px] font-medium">All</label>
        <input
          type="checkbox"
          checked={allChecked}
          onChange={handleToggleAll}
          className="accent-[#5f6fff] w-4 h-4 cursor-pointer"
        />
      </div>

      {/* Grid layout for doctors */}
      <div className="w-full grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pt-5">
        {doctors.map((item, index) => (
          <div
            key={index}
            className="border border-indigo-200 rounded-xl overflow-hidden cursor-pointer group bg-white shadow-sm hover:shadow-lg transform transition-transform duration-300 hover:scale-105"
          >
            <img
              src={item.image}
              alt={item.name}
              className="bg-indigo-50 group-hover:bg-[#5f6fff] transition-all duration-500 w-full h-48 object-cover"
            />
            <div className="p-4">
              <p className="text-neutral-800 text-lg font-medium">{item.name}</p>
              <p className="text-zinc-600 text-sm">{item.speciality}</p>
              <div className="mt-2 flex items-center text-sm gap-2">
                <input
                  onChange={() => handleToggleAvailability(item._id, item.available)}
                  type="checkbox"
                  checked={item.available}
                  readOnly
                  className="accent-[#5f6fff] w-4 h-4"
                />
                <p>Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
