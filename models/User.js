const mongoose = require("mongoose")

const userSchima = new mongoose.Schema({
    userName : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
    },
    role : {
        default : "user",
        type : String
    }

})

const User = mongoose.model("ecommerseUser" , userSchima)
module.exports = User