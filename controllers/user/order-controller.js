const Order = require("../../models/orders-model");
const Product = require("../../models/Product");

const newOrder = async (req, res) => {
    try {
        const { address, productsListWithQuantity, userId } = req.body;

        // Validate input
        if (!userId || !address || !productsListWithQuantity || productsListWithQuantity.length === 0) {
            return res.json({  success : false , message :"Plz provide Proper data" });
        }
 
        // Extract product IDs from the request
        const productIds = productsListWithQuantity.map((item) => item.productId);
        // console.log("productIds",productIds)

        // Fetch all products in one query
        const products = await Product.find({ _id: { $in: productIds } });
        // console.log("products",products)


        if (products.length !== productsListWithQuantity.length) {
            return res.json({  success : false , message :"some products are not avlabile" });
        }

        // Calculate total price and prepare items array
        let totalPrice = 0;
        // console.log("productsListWithQuantity" , productsListWithQuantity)

        const items = productsListWithQuantity.map((item) => {
            const product = products.find((p) => p._id.toString() === item.productId);
            if (!product) {
                throw new Error(`Product with ID ${item.productId} not found.`);
            }

            // Check for sufficient stock (optional, based on your requirements)
            if (item.quantity <= 0) {
                throw new Error(`Invalid quantity for product ID ${item.productId}`);
            }
                // console.log(( product.price * item.quantity))
            totalPrice = totalPrice + ( product.salePrice * item.quantity);
            return {
                productId: product._id,
                quantity: item.quantity,
                image :product.image
            };
        });

        // Create the order
        const newOrder = new Order({
            userId,
            items,
            address,
            totalPrice,
        });

        // Save the order
        await newOrder.save();

        res.status(201).json({ message: "Order created successfully", order: newOrder , success : true });
    } catch (error) {

        res.json({ success : false , message:"plz Provide Proper Data" });
    }
};


const fetchOrders = async (req, res) => {
    try {
        const { userId } = req.params; // Access the userId from params

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is mandatory!",
            });
        }

        // Find all orders for the given userId
        const orders = await Order.find({ userId }); // Use find() to fetch all orders

        if (!orders || orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User has no orders",
            });
        }

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching orders",
        });
    }
};



module.exports = { newOrder ,fetchOrders};
