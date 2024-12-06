const Product = require("../models/Product");
const User = require("../models/User");

const postReviewText = async (req, res) => {
    const { productId, userId, userName, reviewText, rating } = req.body;

    console.log( productId, userId, userName, reviewText, rating)

    // Validate required fields
    if (!productId || !userId || !userName || !reviewText) {
        return res.status(400).json({
            success: false,
            message: "productId, userId, userName, and reviewText are required.",
        });
    }

    try {
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        // Verify if the user purchased the product
        const purchased = user.purchases.some(
            (purchase) => purchase.productId.toString() === productId
        );

        if (!purchased) {
            return res.status(403).json({
                success: false,
                message: "You can only review products you have purchased.",
            });
        }

        // Add the review to the product's reviews array
        product.reviews.push({
            userId,
            userName,
            reviewText,
            rating: rating || null, // Rating is optional
        });

        await product.save();

        return res.status(201).json({
            success: true,
            message: "Review added successfully.",
            product,
        });
    } catch (error) {
        console.error("Error posting review:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};

module.exports = { postReviewText };
