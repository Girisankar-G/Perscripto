import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config.js';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';

//App Config

const app=express()
const port=process.env.PORT || 4000
connectDB()
connectCloudinary()

console.log("Cloudinary ENV:", {
    name: process.env.CLOUDINARY_NAME,
    key: process.env.CLOUDINARY_API_KEY,
    secret: process.env.CLOUDINARY_SECRET_KEY ? "Loaded" : "Missing"
  });
  
//Middlewares
app.use(express.json())
app.use(cors())

//Api Endpoint
app.use('/api/admin',adminRouter)

app.get('/',(req,res)=>{
    res.send('API WORKING')
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})