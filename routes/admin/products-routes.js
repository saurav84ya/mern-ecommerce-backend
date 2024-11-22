const express = require("express");
const { handleImageUpload , addProduct , fetchAllProducts ,editProduct ,deleteProduct , fetchUsers} = require("../../controllers/admin/products-controllers");
const { upload } = require("../../helpers/cloudinary");

const router = express.Router();

router.post("/imageUpload", upload.single('my_file'), handleImageUpload);
router.post("/addProduct", addProduct); 
router.get("/fetchAllProducts", fetchAllProducts); 
router.post("/editProducts/:id", editProduct);
router.delete("/delateProduct/:id", deleteProduct);
router.get("/fetchUsers", fetchUsers);



module.exports = router;
