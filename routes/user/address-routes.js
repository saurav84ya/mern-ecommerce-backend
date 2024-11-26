const {addAddress, editAddress, fetchAllAddress, deleteAddress} = require("../../controllers/user/address-controller")
const {Router} = require("express")

const router = Router()

router.post('/addAddress',addAddress)
router.get('/getAddress/:userId',fetchAllAddress)
router.put('/editAddress/:userId/:addressId',editAddress)
router.delete('/deleteAddress/:userId/:addressId',deleteAddress)
router.get('/' , (req,res)=>{
    res.send("hiiii ed")
})

module.exports = router