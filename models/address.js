const {Schema , model} = require("mongoose")

const addressSchima = new Schema({
    userId : String,
    address : String,
    city :String,
    pincode : String,
    phone : String,
    notes : String
},{timestamps : true})

module.exports = model('ecommerseAddress' , addressSchima)