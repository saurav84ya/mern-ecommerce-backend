const express = require("express");
const { handleImageUpload } = require("../../controllers/admin/products-controllers");
const { upload } = require("../../helpers/cloudinary");

const router = express.Router();

router.post("/imageUpload", upload.single('my_file'), handleImageUpload); // Make sure 'my_file' is the correct input name

module.exports = router;
