
const Order = require("../../models/orders-model")


const adminGetAllOrders = async(req,res) =>{
    const orders = await Order.find(); 
    res.json(orders)
}


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
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true } 
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found." });
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