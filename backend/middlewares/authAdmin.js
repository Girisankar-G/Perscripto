import jwt from 'jsonwebtoken';

const authAdmin = async (req, res, next) => {
    try {
        console.log("Headers:", req.headers);

        const { atoken } = req.headers;
        if (!atoken) {
            return res.status(401).json({ success: false, message: "Token missing" });
        }

        const decoded = jwt.verify(atoken, process.env.JWT_SECRET);

        // Log the decoded token to check its contents
        console.log("Decoded Token:", decoded);

        // Check if the token belongs to admin
        if (decoded.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        // You can attach admin info to request if needed
        req.admin = decoded;
        next();
    } catch (error) {
        console.error("Authentication error:", error.message);
        return res.status(401).json({ success: false, message: "Unauthorized or Token expired" });
    }
};




export default authAdmin;