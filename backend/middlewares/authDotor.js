import jwt from "jsonwebtoken";

const authDoctor = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log("Authorization Header:", authHeader);  // Log the header
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Not Authorised Login Again" });
        }

        const token = authHeader.split(" ")[1];  // Extract the token
        console.log("Token Extracted:", token);  // Log the token

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);  // Log the decoded token
        console.log(decoded)
        req.user = decoded; 
        next();
    } catch (error) {
        console.error("Authentication error:", error.message);
        return res.status(401).json({ success: false, message: error.message });
    }
};


export default authDoctor;
