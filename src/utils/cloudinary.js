import { v2 as cloudinary } from 'cloudinary';
import { response } from 'express';
import fs from "fs"
cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });
    
const uploadOnCloudinary = async (localFilePath) => {
        try {
            if (!localFilePath) return null;
            //Upload the file on cloudinary
            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type:"auto"
            })
            //file has been uploaded successfully
            console.log("file has upload on cloudinary", response.url);
            return response;
        } catch (error) {
            fs.unlinkSync(localFilePath) // remove the localy saved temporary file as the upload operation got failed
            return null;
        }
}
    export {uploadOnCloudinary}