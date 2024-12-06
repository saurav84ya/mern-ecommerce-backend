const User = require("../models/User")

const fetchUserPurchaseProducts = async (req,res) => {
    try {
        const { userId } = req.params

        // Validate the input
        if (!userId) {
            return res.status(400).json({
                message: "Provide UserID",
                success: false,
            });
        }

        // Fetch the user by ID and populate purchases if necessary
        const user = await User.findById(userId).populate("purchases.productId");

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false,
            });
        }


        const purchaseProductsList = user.purchases.map(purchase => ({
            productId: purchase.productId._id
        }));

        console.log("result",userId,purchaseProductsList)

        return res.status(200).json({
            success: true,
            purchases: purchaseProductsList,
           
        });

    } catch (error) {
        console.log(error.message)   
    }
}

module.exports = {fetchUserPurchaseProducts}