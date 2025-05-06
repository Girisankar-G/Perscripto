import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { assets } from "../assets/assets";

const SideBar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  return (
    <div className="h-250 bg-white border-r-0 border-t border-gray-300 px-4 pt-6">
      {(aToken || dToken) && (
        <ul className="text-[#515151] mt-5 space-y-1">
          {aToken && (
            <>
              <NavLink
                to="/admin-dashboard"
                className={({ isActive }) =>
                  `flex cursor-pointer md:min-w-72 ${
                    isActive ? "bg-[#F2F3FF] border-r-4 border-[#5f6fff]" : ""
                  }`
                }
              >
                <div className="flex items-center gap-3 py-3.5 pl-3 pr-3 md:pl-6 md:pr-6 w-full">
                  <img src={assets.home_icon} alt="" />
                  <p>Dashboard</p>
                </div>
              </NavLink>

              <NavLink
                to="/all-appointments"
                className={({ isActive }) =>
                  `flex cursor-pointer md:min-w-72 ${
                    isActive ? "bg-[#F2F3FF] border-r-4 border-[#5f6fff]" : ""
                  }`
                }
              >
                <div className="flex items-center gap-3 py-3.5 pl-3 pr-3 md:pl-6 md:pr-6 w-full">
                  <img src={assets.appointment_icon} alt="" />
                  <p>Appointments</p>
                </div>
              </NavLink>

              <NavLink
                to="/add-doctor"
                className={({ isActive }) =>
                  `flex cursor-pointer md:min-w-72 ${
                    isActive ? "bg-[#F2F3FF] border-r-4 border-[#5f6fff]" : ""
                  }`
                }
              >
                <div className="flex items-center gap-3 py-3.5 pl-3 pr-3 md:pl-6 md:pr-6 w-full">
                  <img src={assets.add_icon} alt="" />
                  <p>Add Doctor</p>
                </div>
              </NavLink>

              <NavLink
                to="/doctor-list"
                className={({ isActive }) =>
                  `flex cursor-pointer md:min-w-72 ${
                    isActive ? "bg-[#F2F3FF] border-r-4 border-[#5f6fff]" : ""
                  }`
                }
              >
                <div className="flex items-center gap-3 py-3.5 pl-3 pr-3 md:pl-6 md:pr-6 w-full">
                  <img src={assets.people_icon} alt="" />
                  <p>Doctors List</p>
                </div>
              </NavLink>
            </>
          )}

          {dToken && (
            <>
              <NavLink
                to="/doctor-dashboard"
                className={({ isActive }) =>
                  `flex cursor-pointer md:min-w-72 ${
                    isActive ? "bg-[#F2F3FF] border-r-4 border-[#5f6fff]" : ""
                  }`
                }
              >
                <div className="flex items-center gap-3 py-3.5 pl-3 pr-3 md:pl-6 md:pr-6 w-full">
                  <img src={assets.home_icon} alt="" />
                  <p>Dashboard</p>
                </div>
              </NavLink>

              <NavLink
                to="/doctor-appointments"
                className={({ isActive }) =>
                  `flex cursor-pointer md:min-w-72 ${
                    isActive ? "bg-[#F2F3FF] border-r-4 border-[#5f6fff]" : ""
                  }`
                }
              >
                <div className="flex items-center gap-3 py-3.5 pl-3 pr-3 md:pl-6 md:pr-6 w-full">
                  <img src={assets.appointment_icon} alt="" />
                  <p>Appointments</p>
                </div>
              </NavLink>

              <NavLink
                to="/doctor-profile"
                className={({ isActive }) =>
                  `flex cursor-pointer md:min-w-72 ${
                    isActive ? "bg-[#F2F3FF] border-r-4 border-[#5f6fff]" : ""
                  }`
                }
              >
                <div className="flex items-center gap-3 py-3.5 pl-3 pr-3 md:pl-6 md:pr-6 w-full">
                  <img src={assets.people_icon} alt="" />
                  <p>Profile</p>
                </div>
              </NavLink>
            </>
          )}
        </ul>
      )}
    </div>
  );
};

export default SideBar;
