import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import razorpay from "razorpay";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !password || !email) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.json({
        success: false,
        message:
          "Password must be 8 characters with uppercase, lowercase, number, and special character",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API for user login

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Request Body:", req.body);
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ sucess: false, message: "User does not exists" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to get user profile data

export const getProfile = async (req, res) => {
  try {
    const { id: userId } = req.user; // get userId from req.user (set by authUser)
    const userData = await userModel.findById(userId).select("-password"); // exclude password
    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to update user profile data
export const updateProfile = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Missing Details" });
    }

    console.log("Updating profile for userId:", userId);

    const parsedAddress = JSON.parse(address);
    console.log("Parsed address:", parsedAddress);

    await userModel.findByIdAndUpdate(
      userId,
      {
        name,
        phone,
        address: parsedAddress,
        dob,
        gender,
      },
      { new: true, runValidators: true }
    );

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageUrl = imageUpload.secure_url;
      await userModel.findByIdAndUpdate(
        userId,
        { image: imageUrl },
        { new: true }
      );
    }

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.log("Error during updateProfile:", error.message);
    res.json({ success: false, message: error.message });
  }
};

//API to book appointment

export const bookAppointment = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { docId, slotDate, slotTime } = req.body;
    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData.available) {
      return res.json({ success: false, message: "Doctor Not Available" });
    }

    let slots_booked = docData.slots_booked;

    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot Already Booked" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");

    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      slotDate,
      slotTime,
      userData,
      docData,
      amount: docData.fees,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    //save new slots data in docdata

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment booked successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API  to get user appointments
export const listAppointments = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const appointments = await appointmentModel.find({ userId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to cancel Appointment
export const cancelAppointment = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    //verify appointment user
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized User" });
    }
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

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Pay
export const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData || appointmentData.cancelled) {
      return res.json({
        success: false,
        message: "Invalid Appointment or Cancelled",
      });
    }
    const options = {
      amount: appointmentData.amount * 100,
      currency: "INR",
      receipt: appointmentId,
    };

    const order = await razorpayInstance.orders.create(options);

    res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to verify
export const verifyRazorpay=async(req,res)=>{
  try {
    const {razorpay_order_id}=req.body
    const orderInfo=await razorpayInstance.orders.fetch(razorpay_order_id)
    console.log(orderInfo)
    if(orderInfo.status==="paid"){
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
      res.json({success:true,message:"Payment Successfull"})
    }
    else{
      res.json({success:false,message:"Payment Unsuccessfull"})
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}