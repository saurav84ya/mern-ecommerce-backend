const express = require("express")
const router = express.Router();
const {getFilteredProducts} = require("../../controllers/user/products-controller-user")

router.get("/get", getFilteredProducts);

module.exports = router