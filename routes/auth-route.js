const express = require("express")
const  { register,login, logoutUser, authMiddleware} = require("../controllers/auth-controller")

const router = express.Router()

router.post("/register" , register)
router.post("/login" , login)
router.post("/logout" , logoutUser)

router.get("/checkauth",authMiddleware , (req,res) => {
    const user = req.user
    res.json({
        message : "You are authenticated",
        user,
        success : true
    })
})






module.exports = router 