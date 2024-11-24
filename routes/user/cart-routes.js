const express = require("express")
const {addTOCart,updateCart,delateCart,fetchCart} = require("../../controllers/user/cart-controller")

const router  = express.Router()


router.post('/addCart',addTOCart)
router.get('/getCart/:userId',fetchCart)
router.put('/updateCart',updateCart)
router.delete('/:userId/:productId',delateCart)

module.exports = router