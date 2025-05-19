import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    try {

        const { token } = req.headers;
        if (!token) {
            return res.status(401).json({ success: false, message: "Not Authorised Login Again" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; 
        
        console.log("Decoded Token:", decoded);
        next();
    } catch (error) {
        console.error("Authentication error:", error.message);
        return res.status(401).json({ success: false, message: error.message });
    }
};




export default authUser;