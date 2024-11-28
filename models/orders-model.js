const { Schema, model } = require("mongoose");

const ordersSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                image :{
                    type :String
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                status: {
                    type: String,
                    enum: ["pending", "cancelled", "delivered"],
                    default: "pending",
                },
            },
        ],
        address: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            pincode: { type: String, required: true },
            phone: { type: String, required: true },
            notes: { type: String },
        },
        status: {
            type: String,
            enum: ["pending", "processing", "shipped", "rejected", "delivered"],
            default: "pending",
        },
        totalPrice: { type: Number, required: true },
    },
    { timestamps: true }
);

module.exports = model("ecommerseOrder", ordersSchema);
