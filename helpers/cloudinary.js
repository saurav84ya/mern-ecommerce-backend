const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME ,
    api_key: process.env.API_KEY ,
    api_secret: process.env.API_SECRET
});


const storage = multer.memoryStorage();

async function ImageUploadUtils(fileBuffer) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            resource_type: "auto"
        }, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });

        uploadStream.end(  fileBuffer); // Send the file buffer to Cloudinary
    });
}

const upload = multer({ storage });

module.exports = { upload, ImageUploadUtils };
