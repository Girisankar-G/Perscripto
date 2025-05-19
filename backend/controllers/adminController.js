import bcrypt from "bcryptjs";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";

const addDoctor = async (req, res) => {
  try {
    console.log("Incoming request body:", req.body);
    console.log("Incoming file:", req.file);

    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;

    const image = req.file;

    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address ||
      !image
    ) {
      console.log("Missing fields");
      return res.json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    if (!validator.isEmail(email)) {
      console.log("Invalid email format");
      return res.json({ success: false, message: "Invalid email format" });
    }

    if (!validator.isStrongPassword(password)) {
      console.log("Weak password");
      return res.json({
        success: false,
        message:
          "Password must be at least 8 characters long and contain a mix of letters, numbers, and symbols",
      });
    }

    const existingDoctor = await doctorModel.findOne({ email });
    if (existingDoctor) {
      console.log("Doctor already exists");
      return res
        .status(400)
        .json({ success: false, message: "Doctor already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("Uploading image to Cloudinary...");
    const imageUpload = await cloudinary.uploader.upload(image.path, {
      resource_type: "image",
    });

    const imageUrl = imageUpload.secure_url;
    console.log("Image uploaded:", imageUrl);

    let parsedAddress;
    try {
      parsedAddress = JSON.parse(address);
    } catch (err) {
      console.log("Invalid address JSON:", address);
      return res.json({ success: false, message: "Invalid address format" });
    }

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: parsedAddress,
      date: Date.now(),
    };

    console.log("Saving new doctor:", doctorData);
    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    console.log("Doctor saved successfully");
    res.json({ success: true, message: "Doctor added successfully" });
  } catch (error) {
    console.error("🔥 Error in addDoctor:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//API for admin login

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Received email:", email);
    console.log("Received password:", password);
    console.log("Stored admin email:", process.env.ADMIN_EMAIL);
    console.log("Stored admin password:", process.env.ADMIN_PASSWORD);

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const payload = {
        email,
        role: "admin",
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.json({ success: true, message: "Login successful", token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("🔥 Error in loginAdmin:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).sort({ date: -1 });
    res.json({ success: true, doctors });
  } catch (error) {
    console.error("🔥 Error in allDoctors:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


//API to get all appointments list
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({ success: true, appointments });
  } catch (error) {
    console.error("🔥 Error in appointmentsAdmin:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//API for Appointment cancellation
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });
    //Releasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    let slots_booked = doctorData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    res.json({ success: true, message: "Appointment Cancelled Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to get dashboard data
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).sort({ date: -1 });
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});
    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };
    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  addDoctor,
  loginAdmin,
  allDoctors,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
};
