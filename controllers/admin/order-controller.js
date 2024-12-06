
const Order = require("../../models/orders-model");
const User = require("../../models/User");


const adminGetAllOrders = async(req,res) =>{
    const orders = await Order.find(); 
    res.json(orders)
}


// const updateOrderStatus = async (req, res) => {
//   const { orderId, status } = req.body;

//   if (!orderId || !status) {
//     return res.status(400).json({ message: "Order ID and status are required." });
//   }

//   console.log("orderId",orderId , status)

//   const validStatuses = ["pending", "processing", "shipped", "rejected", "delivered"];
//   if (!validStatuses.includes(status)) {
//     return res.status(400).json({ message: `Invalid status. Valid statuses are: ${validStatuses.join(", ")}` });
//   }

//   try {
//     const updatedOrder = await Order.findByIdAndUpdate(
//       orderId,
//       { status },
//       { new: true } 
//     );

//     if (!updatedOrder) {
//       return res.status(404).json({ message: "Order not found." });
//     }

//     return res.status(200).json({
//       message: "Order status updated successfully.",
//       order: updatedOrder,
//     });
//   } catch (error) {
//     // console.error("Error updating order status:", error);
//     return res.status(500).json({ message: "Internal server error." });
//   }
// };


const updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;

  if (!orderId || !status) {
      return res.status(400).json({ message: "Order ID and status are required." });
  }

  const validStatuses = ["pending", "processing", "shipped", "rejected", "delivered"];
  if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Valid statuses are: ${validStatuses.join(", ")}` });
  }

  try {
      // Find the order and update its status
      const updatedOrder = await Order.findByIdAndUpdate(
          orderId,
          { status },
          { new: true }
      ).populate("items.productId"); // Populate product details for the items

      if (!updatedOrder) {
          return res.status(404).json({ message: "Order not found." });
      }
      console.log(updatedOrder)
      // If the order is delivered, update the user's purchases
      if (status === "delivered") {
          const user = await User.findById(updatedOrder.userId);

          if (!user) {
              return res.status(404).json({ message: "User not found." });
          }

          // Add purchased products to the user's purchases array
          updatedOrder.items.forEach(item => {
              const alreadyPurchased = user.purchases.some(
                  purchase => purchase.productId.toString() === item.productId._id.toString()
              );

              if (!alreadyPurchased) {
                  user.purchases.push({
                      productId: item.productId._id,
                      purchaseDate: new Date(),
                  });
              }
          });

          await user.save();
      }

      return res.status(200).json({
          message: "Order status updated successfully.",
          order: updatedOrder,
      });
  } catch (error) {
      console.error("Error updating order status:", error);
      return res.status(500).json({ message: "Internal server error." });
  }
};



module.exports={adminGetAllOrders,updateOrderStatus}