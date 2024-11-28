const mongoose = require("mongoose")

const ProductSchima = new mongoose.Schema({
    image : String ,
    title : String,
    description : String,
    category : String,
    brand : String,
    price : Number ,
    salePrice : Number ,
    totalStock : Number,
    averageReview : Number
} , {timestamps :true})

  module.exports = mongoose.model("ecommerseProduct" , ProductSchima);