import express from 'express';
import { addDoctor,allDoctors,loginAdmin,appointmentsAdmin, appointmentCancel ,adminDashboard} from '../controllers/adminController.js';
import upload from '../middlewares/mutler.js';
import authAdmin from '../middlewares/authAdmin.js';
import {  changeAvailability } from '../controllers/doctorController.js';

const adminRouter = express.Router();

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)
adminRouter.post('/login',loginAdmin)
adminRouter.post('/all-doctors',authAdmin,allDoctors)
adminRouter.post('/change-availability',authAdmin,changeAvailability)
adminRouter.post('/appointments',authAdmin,appointmentsAdmin)
adminRouter.post('/cancel-appointment',authAdmin,appointmentCancel)
adminRouter.post('/dashboard',authAdmin,adminDashboard)

export default adminRouter;