import { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import axios from "axios"; // Ensure axios is imported
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const { dToken, profileData, getProfileData } = useContext(DoctorContext);
  const { currency } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);

  const updateProfile = async () => {
    try {
      const updateData = {
        address: editedProfile.address,
        fees: editedProfile.fees,
        available: editedProfile.available,
      };
  
      const { data } = await axios.post(
        `http://localhost:4000/api/doctor/update-profile`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${dToken}`,
          },
        }
      );
  
      if (data.success) {
        toast.success(data.message || "Profile updated");
        getProfileData(); // no need to pass anything
        setIsEdit(false);
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating profile");
    }
  };
  
  
  

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  useEffect(() => {
    if (profileData) {
      setEditedProfile(profileData);
    }
  }, [profileData]);

  if (!profileData || !editedProfile) return null;

  const handleCancel = () => {
    setEditedProfile(profileData); // Reset to original data
    setIsEdit(false);
  };

  return (
    <div className="min-h-screen w-full py-10 flex justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100 text-gray-700">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl">
        {/* Profile Image */}
        <div className="flex flex-col items-center gap-4">
          <img
            src={profileData.image}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-[#5f6fff] shadow-sm"
          />
          <h1 className="text-2xl font-semibold">{profileData.name}</h1>
        </div>

        {/* Doctor Info */}
        <div className="mt-8 space-y-5 text-sm sm:text-base">
          <p className="text-lg font-semibold text-[#5f6fff] border-b pb-1">
            PROFESSIONAL DETAILS
          </p>

          <div>
            <p className="text-gray-500 font-medium">Degree & Speciality:</p>
            <p>
              {profileData.degree} - {profileData.speciality}
            </p>
          </div>

          <div>
            <p className="text-gray-500 font-medium">Experience:</p>
            <p>{profileData.experience} years</p>
          </div>

          <div>
            <p className="text-gray-500 font-medium">About:</p>
            <p>{profileData.about}</p>
          </div>

          <div>
            <p className="text-gray-500 font-medium">Appointment Fee:</p>
            <p>
              {currency}{" "}
              {isEdit ? (
                <input
                  type="number"
                  className="border px-2 py-1 rounded w-24"
                  value={editedProfile.fees}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      fees: e.target.value,
                    })
                  }
                />
              ) : (
                profileData.fees
              )}
            </p>
          </div>

          <p className="text-lg font-semibold text-[#5f6fff] border-b pb-1 pt-2">
            ADDRESS
          </p>

          <div>
            <p className="text-gray-500 font-medium">Line 1:</p>
            {isEdit ? (
              <input
                type="text"
                className="border px-2 py-1 rounded w-full max-w-md"
                value={editedProfile.address.line1}
                onChange={(e) =>
                  setEditedProfile({
                    ...editedProfile,
                    address: {
                      ...editedProfile.address,
                      line1: e.target.value,
                    },
                  })
                }
              />
            ) : (
              <p>{profileData.address.line1}</p>
            )}
          </div>

          <div>
            <p className="text-gray-500 font-medium">Line 2:</p>
            {isEdit ? (
              <input
                type="text"
                className="border px-2 py-1 rounded w-full max-w-md"
                value={editedProfile.address.line2}
                onChange={(e) =>
                  setEditedProfile({
                    ...editedProfile,
                    address: {
                      ...editedProfile.address,
                      line2: e.target.value,
                    },
                  })
                }
              />
            ) : (
              <p>{profileData.address.line2}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isEdit ? (
              <>
                <input
                  type="checkbox"
                  id="available"
                  checked={editedProfile.available}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      available: e.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-[#5f6fff]" // Add color accent to checkbox
                />
                <label htmlFor="available" className="text-lg font-medium text-[#5f6fff]">
                  Available
                </label>
              </>
            ) : (
              <>
                <input
                  checked={profileData.available}
                  type="checkbox"
                  readOnly
                  id="available"
                  className="w-4 h-4 accent-[#5f6fff]" // Add color accent to checkbox
                />
                <label htmlFor="available" className="text-lg font-medium text-[#5f6fff]">
                  Available
                </label>
              </>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 text-center flex justify-center gap-4">
          <button
            onClick={() => {
              if (isEdit) {
                updateProfile(); // Call updateProfile when saving changes
              }
              setIsEdit((prev) => !prev);
            }}
            className="bg-[#5f6fff] cursor-pointer hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
          >
            {isEdit ? "Save" : "Edit Profile"}
          </button>

          {isEdit && (
            <button
              onClick={handleCancel}
              className="bg-gray-300 cursor-pointer hover:bg-gray-400 text-gray-800 font-medium py-2 px-6 rounded-lg transition duration-300"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
