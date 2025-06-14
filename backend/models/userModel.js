import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    image:{
        type:String,
        default:"data:image/png;base64,iVBORrs4c6QAAAAAAAAElFTkSuQmCC",
    },
    address:{
        type:Object,
        default:{line1:'',line2:''}
    },
    gender:{
        type:String,
        default:"Not Selected",
    },
    dob:{
        type:String,
        default:"Not Selected",
    },
    phone:{
        type:String,
        default:"00000000000",
    },
})

const userModel= mongoose.model.user || mongoose.model("user", userSchema);

export default userModel;