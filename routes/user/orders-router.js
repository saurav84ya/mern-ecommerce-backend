const express = require("express")
const {newOrder,fetchOrders} = require("../../controllers/user/order-controller") 
const router  = express.Router()


router.post('/addOrder',newOrder)
router.get('/fetchOrders/:userId',fetchOrders)



module.exports = router