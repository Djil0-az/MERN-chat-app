// user authorisation middleware using JWTs
const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");
const asyncHandler = require('express-async-handler');

const authorise = asyncHandler(async (req,res,next)=>{
    let token;
    // check if user is authorized using bearer token 
    if(
        req.headers.authorization && req.headers.authorization.startsWith("Bearer")
    ){
        try{
            // split bearer from token 
            token = req.headers.authorization.split(" ")[1];
            // decode token id
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            //get user without password
            req.user = await User.findById(decoded.id).select("-password");

            next();
        }catch(error){
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }
    if(!token){
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});
module.exports = {authorise};