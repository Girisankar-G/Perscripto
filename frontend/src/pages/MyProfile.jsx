import React, { useState } from 'react'
import { assets } from '../assets/assets'

const MyProfile = () => {
  const [userData, setUserData] = useState({
    name: 'Edward Vincent',
    image: assets.profile_pic,
    email: 'edwardvincent@gmail.com',
    phone: '+1 123 456 7890',
    address: {
      line1: "57th Cross, Rishmond",
      line2: "Circle, Church Road, London"
    },
    gender: 'Male',
    docb: '2000-01-20'
  })

  const [isEdit, setIsEdit] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedGender, setSelectedGender] = useState(userData.gender)

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen)
  const handleGenderChange = (gender) => {
    setSelectedGender(gender)
    setUserData(prev => ({ ...prev, gender }))
    setDropdownOpen(false)
  }

  return (
    <div className="min-h-screen flex justify-center items-start pt-20 pb-20 bg-gradient-to-br from-blue-50 to-blue-100 text-gray-700">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-xl">
        
        {/* Profile Image + Name */}
        <div className="flex flex-col items-center gap-4">
          <img
            src={userData.image}
            alt="profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-[#5f6fff] shadow-sm"
          />
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-500"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {dropdownOpen && (
                  <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
                    <div
                      className="p-2 hover:bg-[#f0f4ff] cursor-pointer"
                      onClick={() => handleGenderChange('Male')}
                    >
                      Male
                    </div>
                    <div
                      className="p-2 hover:bg-[#f0f4ff] cursor-pointer"
                      onClick={() => handleGenderChange('Female')}
                    >
                      Female
                    </div>
                    <div
                      className="p-2 hover:bg-[#f0f4ff] cursor-pointer"
                      onClick={() => handleGenderChange('Other')}
                    >
                      Other
                    </div>
                    <div
                      className="p-2 hover:bg-[#f0f4ff] cursor-pointer"
                      onClick={() => handleGenderChange('Prefer not to say')}
                    >
                      Prefer not to say
                    </div>
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
                value={userData.docb}
                onChange={(e) => setUserData(prev => ({ ...prev, docb: e.target.value }))}
                className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#5f6fff] bg-white text-gray-700 shadow-sm"
              />
            ) : (
              <p>{userData.docb}</p>
            )}
          </div>
        </div>

        {/* Edit / Save Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setIsEdit(!isEdit)}
            className="bg-[#5f6fff] hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
          >
            {isEdit ? 'Save' : 'Edit Profile'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default MyProfile
