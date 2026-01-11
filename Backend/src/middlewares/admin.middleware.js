import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"  

const adminMiddleware = asyncHandler( async (req,res,next) => {
    const admin = req.user;

    const checkAdmin = await User.findById(admin._id);
    if( checkAdmin.role !== "ADMIN" ){
        console.log("Access denied, Admins only" , checkAdmin , " user role: ", checkAdmin.role);
        throw new ApiError(403,"Access denied, Admins only")
    }
    next()
})

export { adminMiddleware }