const { ImageUploadUtils } = require("../../helpers/cloudinary");

const handleImageUpload = async (req, res) => {
    try {
        const result = await ImageUploadUtils(req.file.buffer); // Directly pass the file buffer
        res.json({
            success: true,
            result
        });
    } catch (error) {
        console.log("error at handleImageUpload");
        res.json({
            success: false,
            message: "Error at handleImageUpload"
        });
    }
};

module.exports = { handleImageUpload };
