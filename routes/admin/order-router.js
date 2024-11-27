const express = require("express")
const {adminGetAllOrders ,updateOrderStatus} = require("../../controllers/admin/order-controller")

const router = express.Router()

router.get("/adminGetOrders",adminGetAllOrders)
router.patch("/adminUpdateOrders",updateOrderStatus)



module.exports = router