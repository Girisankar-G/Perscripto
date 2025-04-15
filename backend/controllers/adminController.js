import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import validator from "validator";
import { v2 as cloudinary } from 'cloudinary';
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
            address
        } = req.body;

        const image = req.file;

        if (
            !name || !email || !password || !speciality ||
            !degree || !experience || !about ||
            !fees || !address || !image
        ) {
            console.log("Missing fields");
            return res.json({ success: false, message: "Please fill all the fields" });
        }

        if (!validator.isEmail(email)) {
            console.log("Invalid email format");
            return res.json({ success: false, message: "Invalid email format" });
        }

        if (!validator.isStrongPassword(password)) {
            console.log("Weak password");
            return res.json({
                success: false,
                message: "Password must be at least 8 characters long and contain a mix of letters, numbers, and symbols"
            });
        }

        const existingDoctor = await doctorModel.findOne({ email });
        if (existingDoctor) {
            console.log("Doctor already exists");
            return res.status(400).json({ success: false, message: "Doctor already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log("Uploading image to Cloudinary...");
        const imageUpload = await cloudinary.uploader.upload(image.path, {
            resource_type: "image"
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
            date: Date.now()
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

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const payload = {
                email,
                role: 'admin'
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ success: true, message: "Login successful", token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error("🔥 Error in loginAdmin:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};







export {addDoctor,loginAdmin};