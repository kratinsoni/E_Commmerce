import {v2 as cloudinary} from "cloudinary";
import fs from "fs/promises";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async(localFilePath) =>{
        try{
            if(!localFilePath) return null
            //upload file on cloudinary
            const response = await cloudinary.uploader.upload(
                localFilePath,{resource_type: "auto"})
            //file has been uploaded successfully
            console.log("file has been uploaded successfully",response.url);
            // fs.unlinkSync(localFilePath)
            // return response;
            // Try to delete the local file, but don't fail if it doesn't work
            
        try {
            await fs.unlink(localFilePath);
            console.log("Local file deleted successfully.");
        } catch (err) {
            console.error("Failed to delete local file:", err);
            // Don't throw here - the upload was successful
        }return response;
        }
        catch(error){
            // after avatar file is required error 

            console.error("Error during Cloudinary upload:", error);
            
            // Try to delete the local file if upload failed
            try {
                await fs.unlink(localFilePath);
                console.log("Local file deleted after upload failure.");
            } catch (err) {
                console.error("Failed to delete file after upload failure:", err);
            }
            return null;
        }
}

const extractPublicId = (imageUrl) => {
  const parts = imageUrl.split('/');
  const filename = parts.pop().split('.')[0];

  const uploadIndex = parts.indexOf('upload');
  const folderPath = parts.slice(uploadIndex + 2).join('/'); // skip version

  console.log("filename:", filename);

  return `${filename}`;
};

const deleteFromCloudinary = async ( imageUrl ) => {
    try {
        if ( !imageUrl ) return null;  
         
        // Extract public ID from the image URL
        const publicId = extractPublicId(imageUrl);

        console.log("imageUrl" , imageUrl, "publicId -", publicId);
        
        await cloudinary.uploader.destroy( publicId ).then(result => console.log("Cloudinary deletion result:", result));

        return null;
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        return null;
    }
}

export { uploadOnCloudinary, deleteFromCloudinary }