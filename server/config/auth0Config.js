import jwt from "jsonwebtoken";

const jwtCheck = (req, res, next) => {
  const token = req.cookies.token; // Retrieve the token from cookies
  console.log("Token:", token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = { id: decoded.id, email: decoded.email }; // Attach user info to req
    console.log("Decoded JWT:", decoded);

    next();
  } catch (error) {
    console.error("JWT Error:", error); // Log the error for debugging
    return res.status(403).json({ 
      message: "Invalid or expired token",
      error: error.message, // Include the error message in the response
      stack: error.stack // Optionally include the stack trace
    });
  }
};

export default jwtCheck;
