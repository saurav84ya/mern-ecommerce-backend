const {Schema ,model} = require("mongoose")

const CartSchima = new Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    items :[
        {
            productId : {
                type : Schema.Types.ObjectId,
                ref :'Product',
                required : true
            },
            quantity :{
                type : Number,
                required : true,
                min : 1
            }
        }
    ]
},{
    timestamps : true
} )

module.exports = model("ecommersecart",CartSchima)
