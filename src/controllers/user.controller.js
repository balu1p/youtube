import { asyncHandler } from '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiError.js";
import { User } from '../models/user.models.js';
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from '../utils/ApiResponse.js'

const registerUser = asyncHandler( async (req, res)=>{
    //Get Users details
    const {fullName, email, username, password} = req.body;

    //validation
    if([fullName, email, username, password].some((field)=>field?.trim() == "")){
        throw new ApiError(400, "All filds are compulsory");
    }

    // User 
    const exitedUser = User.findOne({
        $or: [{username}, {email}]
    });

    if(exitedUser) {
        throw new ApiError(409, "User with email or username already exits");
    }

    // avatar and coverImage

    const avatarLocalPath = req.files?.avatar[0].path;
   const coverImageLocalPath = req.files?.coverImage[0].path;

   if(!avatarLocalPath) {
    throw new ApiError(400, "avatar is required")
   }

   const avatar = await uploadCloudinary(avatarLocalPath);
   const coverImage = await uploadCloudinary(coverImageLocalPath);

   if(!avatar) {
    throw new ApiError(400, "avatar is required")
   }

   const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
   });

   const createdUser = await User.findById(user._id).select("-password -refreshToken")

   if(!createdUser) {
    throw new ApiError(500, "something went wrong while register the user")
   }

   return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
   )
})

export {registerUser}