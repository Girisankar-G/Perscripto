import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState(userData.gender);
  const [image, setImage] = useState(null);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleGenderChange = (gender) => {
    setSelectedGender(gender);
    setUserData(prev => ({ ...prev, gender }));
    setDropdownOpen(false);
  };

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('gender', userData.gender);
      formData.append('dob', userData.dob);
      formData.append('address', JSON.stringify(userData.address));
      image && formData.append('image', image);

      const {data}=await axios.post(`${backendUrl}/api/user/update-profile`, formData, {headers: {token}});
      if (data.success) {
        toast.success(data.message)
        await loadUserProfileData(); 
        setIsEdit(false);
        setImage(false)
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message)
    }
  };

  return userData && (
    <div className="min-h-screen flex justify-center items-start pt-20 pb-20 bg-gradient-to-br from-blue-50 to-blue-100 text-gray-700">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-xl">
        
        {/* Profile Image + Name */}
        <div className="flex flex-col items-center gap-4">
          {isEdit ? (
            <label htmlFor="image" className="cursor-pointer relative">
              <img
                src={image ? URL.createObjectURL(image) : userData.image}
                alt="profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-[#5f6fff] shadow-sm"
              />
              <img
                src={assets.upload_icon}
                alt="upload"
                className="absolute bottom-0 right-0 w-8 h-8"
              />
              <input
                type="file"
                id="image"
                hidden
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
          ) : (
            <img
              src={userData.image}
              alt="profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-[#5f6fff] shadow-sm"
            />
          )}

          {isEdit ? (
            <input
              type="text"
              value={userData.name}
              onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
              className="text-lg font-medium border border-gray-300 p-2 rounded-md w-full max-w-sm text-center focus:outline-none focus:ring-2 focus:ring-[#5f6fff]"
            />
          ) : (
            <h1 className="text-2xl font-semibold">{userData.name}</h1>
          )}
        </div>

        {/* Contact Info */}
        <div className="mt-8 space-y-5 text-sm sm:text-base">
          <p className="text-lg font-semibold text-[#5f6fff] border-b pb-1">CONTACT INFORMATION</p>

          <div>
            <p className="text-gray-500 font-medium">Email:</p>
            <p>{userData.email}</p>
          </div>

          <div>
            <p className="text-gray-500 font-medium">Phone:</p>
            {isEdit ? (
              <input
                type="text"
                value={userData.phone}
                onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#5f6fff]"
              />
            ) : (
              <p>{userData.phone}</p>
            )}
          </div>

          <div>
            <p className="text-gray-500 font-medium">Address:</p>
            {isEdit ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={userData.address.line1}
                  onChange={(e) =>
                    setUserData(prev => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value }
                    }))
                  }
                  className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#5f6fff]"
                />
                <input
                  type="text"
                  value={userData.address.line2}
                  onChange={(e) =>
                    setUserData(prev => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value }
                    }))
                  }
                  className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#5f6fff]"
                />
              </div>
            ) : (
              <>
                <p>{userData.address.line1}</p>
                <p>{userData.address.line2}</p>
              </>
            )}
          </div>

          <p className="text-lg font-semibold text-[#5f6fff] border-b pb-1 pt-2">BASIC INFORMATION</p>

          <div>
            <p className="text-gray-500 font-medium">Gender:</p>
            {isEdit ? (
              <div className="relative">
                <div
                  className="flex justify-between items-center border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#5f6fff] bg-white text-gray-700 cursor-pointer"
                  onClick={toggleDropdown}
                >
                  <p className="text-sm">{selectedGender}</p>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" className="w-5 h-5 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {dropdownOpen && (
                  <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
                    {['Male', 'Female', 'Other', 'Prefer not to say'].map((gender) => (
                      <div
                        key={gender}
                        className="p-2 hover:bg-[#f0f4ff] cursor-pointer"
                        onClick={() => handleGenderChange(gender)}
                      >
                        {gender}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p>{userData.gender}</p>
            )}
          </div>

          <div>
            <p className="text-gray-500 font-medium">Date of Birth:</p>
            {isEdit ? (
              <input
                type="date"
                value={userData.dob}
                onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#5f6fff] bg-white text-gray-700 shadow-sm"
              />
            ) : (
              <p>{userData.dob}</p>
            )}
          </div>
        </div>

        {/* Edit / Save Button */}
        <div className="mt-8 text-center">
          <button
            onClick={isEdit ? updateUserProfileData : () => setIsEdit(true)}
            className="bg-[#5f6fff] hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
          >
            {isEdit ? 'Save' : 'Edit Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
