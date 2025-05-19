import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    // Fetch the doctor data by id
    const docData = await doctorModel.findById(docId);

    // If doctor not found, return an error response
    if (!docData) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // Toggle the doctor's availability
    const updatedDoctor = await doctorModel.findByIdAndUpdate(
      docId,
      { available: !docData.available },
      { new: true }  // Ensure that the updated document is returned
    );

    res.json({
      success: true,
      message: "Availability Changed",
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);

    res.json({ success: true, doctors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//API for doctor login
export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//API to get appointment of doctor
export const appointmentsDoctor = async (req, res) => {
  try {
    const { id: docId } = req.user;

    const appointments = await appointmentModel.find({ docId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.error("Error in appointmentsDoctor:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//API to make appointment completed
export const appointmentComplete = async (req, res) => {
  try {
    const { id: docId } = req.user;
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return res.json({ success: true, message: "Appointment completed" });
    } else {
      return res.status(500).json({ success: false, message: "Mark Failed" });
    }
  } catch (error) {
    console.error("Error in appointmentComplete:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//API to Cancel appointment completed
export const appointmentCancel= async (req, res) => {
  try {
    const { id: docId } = req.user;
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
      return res.json({ success: true, message: "Appointment Cancelled" });
    } else {
      return res.status(500).json({ success: false, message: "Cancel Failed" });
    }
  } catch (error) {
    console.error("Error in appointmentComplete:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


//API to get DashBoard data for doctor
export const doctorDashboard = async (req, res) => {
  try {
    const { id: docId } = req.user;
    const appointments = await appointmentModel.find({ docId });
    let earnings=0;
    appointments.map((item)=>{
      if(item.isCompleted || item.payment){
        earnings+=item.amount;
      }
    })

    let patients=[]

    appointments.map((item)=>{
      if(!patients.includes(item.userId)){
        patients.push(item.userId)
      }
    })

    const dashData={
      earnings,
      appointments:appointments.length,
      patients:patients.length,
      latestAppointments:appointments.reverse().slice(0,5)
    }

    res.json({
      success: true,
      dashData
    });
  } catch (error) {
    console.error("Error in doctorDashboard:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//API to get doctor profile
export const doctorProfile = async (req, res) => {
  try {
    const { id: docId } = req.user;
    const profileData = await doctorModel.findById(docId).select("-password");
    res.json({ success: true, profileData });
  } catch (error) {
    console.error("Error in doctorProfile:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

//API to update doctor profile
export const updateDoctorProfile = async (req, res) => {
  try {
    const { id: docId } = req.user;
    const { fees, address, available } = req.body;

    const updatedData = await doctorModel.findByIdAndUpdate(
      docId,
      { fees, address, available }
    )

    res.json({ success: true, updatedData });
  } catch (error) {
    console.error("Error in doctorProfileUpdate:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}