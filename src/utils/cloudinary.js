import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key:  process.env.CLOUDINARY_API, 
  api_secret: process.env.CLOUDINARY_SECRET 
});

 
const uploadCloudinary = async(loacalFilePath) =>{
    try {
        if(!loacalFilePath) return null;
        const response = await cloudinary.uploader.upload(loacalFilePath, {
            resource_type: "auto"
        })
        fs.unlinkSync(loacalFilePath)
        return response;
    } catch (error) {
        fs.unlinkSync(loacalFilePath)
    }
}


export {uploadCloudinary}