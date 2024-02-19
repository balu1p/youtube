import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key:  process.env.CLOUDINARY_API, 
  api_secret: process.env.CLOUDINARY_SECRET 
});

 
const uploadCloudinary = async(loacalPath) =>{
    try {
        if(!loacalPath) return null;
        const response = await cloudinary.uploader.upload(loacalPath, {
            resource_type: "auto"
        })
        console.log('File is uploade in cloudinary', response.url)
        return response;
    } catch (error) {
        fs.unlinkSync(loacalPath)
    }
}


export {uploadCloudinary}