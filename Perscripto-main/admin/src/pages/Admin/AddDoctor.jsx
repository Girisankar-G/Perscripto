import React, { useState , useContext } from "react";
import { assets } from "../../assets/assets";
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import the Toastify CSS
import {AdminContext} from "../../context/AdminContext";
import axios from "axios";

const AddDoctor = () => {
  const [showSpecialityDropdown, setShowSpecialityDropdown] = useState(false);
  const [showExperienceDropdown, setShowExperienceDropdown] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [experience, setExperience] = useState("");
  const [fees, setFees] = useState("");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [about, setAbout] = useState("");
  const [docImg, setDocImg] = useState(null);

  const {backendUrl,aToken} = useContext(AdminContext);
  console.log(backendUrl,aToken);

  const handleSpecialitySelect = (value) => {
    setSpeciality(value);
    setShowSpecialityDropdown(false);
  };

  const handleExperienceSelect = (value) => {
    setExperience(value);
    setShowExperienceDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!docImg) {
      toast.error("Please upload a doctor image");
      return;
    }
  
    if (!speciality || !experience) {
      toast.error("Please select both Speciality and Experience");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("speciality", speciality);
      formData.append("fees", fees);
      formData.append("degree", degree);
      formData.append("address", JSON.stringify({ line1: address1, line2: address2 }));
      formData.append("about", about);
      formData.append("image", docImg);
  
      // Make the request
      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-doctor`,
        formData,
        { headers: { aToken } }
      );
  
      if (data.success) {
        toast.success("Doctor added successfully!");
  
        // Reset form fields after success
        setName("");
        setEmail("");
        setPassword("");
        setSpeciality("");
        setExperience("");
        setFees("");
        setDegree("");
        setAddress1("");
        setAddress2("");
        setAbout("");
        setDocImg(null);
      } else {
        toast.error("Failed to add doctor: " + data.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error adding doctor:", error);
      if (error.response) {
        // If response error from server
        console.error("Error response data:", error.response.data);
        toast.error(`Server error: ${error.response.data.message || 'Unknown error'}`);
      } else {
        // If no response from server
        toast.error("Network error or server is down");
      }
    }
  };
  
  

  return (
    <form className="m-5 w-full" onSubmit={handleSubmit}>
      <div className="bg-white p-8 rounded-lg shadow-lg w-[75%] max-w-screen-xl overflow-y-auto">
        <p className="mb-4 text-2xl font-semibold text-gray-800">Add Doctor</p>

        {/* Profile Image Upload */}
        <div className="flex items-center gap-6 mb-8 text-gray-600">
          <label htmlFor="doc-img">
            <img
              className="w-24 h-24 bg-gray-100 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-105 object-cover"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt="Upload Doctor"
            />
          </label>
          <input
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            hidden
          />
          <p className="text-sm text-gray-500">
            Upload doctor <br />
            picture
          </p>
        </div>

        {/* Doctor Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-gray-700">
          <div className="space-y-6">
            {/* Name */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-600">Doctor Name</p>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6fff] focus:border-transparent w-full"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-600">Doctor Email</p>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6fff] focus:border-transparent w-full"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-600">
                Doctor Password
              </p>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6fff] focus:border-transparent w-full"
              />
            </div>

            {/* Experience Dropdown */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-600">
                Doctor Experience
              </p>
              <div className="relative">
                <button
                  type="button"
                  className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6fff] focus:border-transparent w-full text-left`}
                  onClick={() =>
                    setShowExperienceDropdown(!showExperienceDropdown)
                  }
                >
                  {experience || "Select experience"}
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    ˅
                  </span>
                </button>
                {showExperienceDropdown && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10">
                    {[...Array(10)].map((_, i) => {
                      const label = `${i + 1} Year`;
                      return (
                        <div
                          key={label}
                          className="px-4 py-2 cursor-pointer hover:bg-[#5f6fff] text-black"
                          onClick={() => handleExperienceSelect(label)}
                        >
                          {label}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Fees */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-600">Fees</p>
              <input
                type="number"
                placeholder="Fees"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6fff] focus:border-transparent w-full"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Speciality Dropdown */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-600">Speciality</p>
              <div className="relative">
                <button
                  type="button"
                  className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6fff] focus:border-transparent w-full text-left`}
                  onClick={() =>
                    setShowSpecialityDropdown(!showSpecialityDropdown)
                  }
                >
                  {speciality || "Select speciality"}
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    ˅
                  </span>
                </button>
                {showSpecialityDropdown && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10">
                    {[
                      "General physician",
                      "Gynecologist",
                      "Dermatologist",
                      "Pediatricians",
                      "Neurologist",
                      "Gastroenterologist",
                    ].map((item) => (
                      <div
                        key={item}
                        className="px-4 py-2 cursor-pointer hover:bg-[#5f6fff] text-black"
                        onClick={() => handleSpecialitySelect(item)}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Education */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-600">Education</p>
              <input
                type="text"
                placeholder="Education"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6fff] focus:border-transparent w-full"
              />
            </div>

            {/* Address */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-600">Address</p>
              <input
                type="text"
                placeholder="Address 1"
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6fff] focus:border-transparent w-full"
              />
              <input
                type="text"
                placeholder="Address 2"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6fff] focus:border-transparent w-full"
              />
            </div>
          </div>
        </div>

        {/* About */}
        <div className="flex flex-col items-start gap-2 mt-6">
          <p className="text-sm font-medium text-gray-600">About</p>
          <textarea
            placeholder="Write about doctor"
            rows={5}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6fff] focus:border-transparent w-full"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-6 bg-[#5f6fff] cursor-pointer text-white py-3 rounded-lg w-full hover:bg-[#4a58e7] transition duration-300"
        >
          Add Doctor
        </button>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </form>
  );
};

export default AddDoctor;