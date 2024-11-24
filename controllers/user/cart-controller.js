
const Cart = require("../../models/Cart")
const Product = require("../../models/Product")


const addTOCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    let responseMessage = "Added to cart";

    if (findCurrentProductIndex === -1) {
      cart.items.push({ productId, quantity });
    } else {
      cart.items[findCurrentProductIndex].quantity += quantity;
      responseMessage = `Product already added, quantity increased by ${quantity}`;
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: responseMessage,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred",
      error: error.message, // Optional: Provide detailed error information
    });
  }
};


const fetchCart = async(req,res) => {
    try {

        const { userId } = req.params;

        if (!userId) {
          return res.status(400).json({
            success: false,
            message: "User id is manadatory!",
          });
        }
    
        const cart = await Cart.findOne({ userId }).populate({
          path: "items.productId",
          select: "image title price salePrice",
        });
    
        if (!cart) {
          return res.status(404).json({
            success: false,
            message: "Cart not found!",
          });
        }
    
        const validItems = cart.items.filter(
          (productItem) => productItem.productId
        );
    
        if (validItems.length < cart.items.length) {
          cart.items = validItems;
          await cart.save();
        }
    
        const populateCartItems = validItems.map((item) => ({
          productId: item.productId._id,
          image: item.productId.image,
          title: item.productId.title,
          price: item.productId.price,
          salePrice: item.productId.salePrice,
          quantity: item.quantity,
          totalStock : item.totalStock,
        }));
    
        res.status(200).json({
          success: true,
          data: {
            ...cart._doc,
            items: populateCartItems,
          },
        });
        
    } catch (error) {
        res.json({
            sucess : false,
            message : "error"
        })
    }
}

const updateCart = async(req,res) => {
  console.log("yessss")
    try {

        const { userId, productId, quantity } = req.body;

        if (!userId || !productId || quantity <= 0) {
          return res.status(400).json({
            success: false,
            message: "Invalid data provided!",
          });
        }
    
        const cart = await Cart.findOne({ userId });
        if (!cart) {
          return res.status(404).json({
            success: false,
            message: "Cart not found!",
          });
        }
    
        const findCurrentProductIndex = cart.items.findIndex(
          (item) => item.productId.toString() === productId
        );
    
        if (findCurrentProductIndex === -1) {
          return res.status(404).json({
            success: false,
            message: "Cart item not present !",
          });
        }
    
        cart.items[findCurrentProductIndex].quantity = quantity;
        await cart.save();
    
        await cart.populate({
          path: "items.productId",
          select: "image title price salePrice",
        });
    
        const populateCartItems = cart.items.map((item) => ({
          productId: item.productId ? item.productId._id : null,
          image: item.productId ? item.productId.image : null,
          title: item.productId ? item.productId.title : "Product not found",
          price: item.productId ? item.productId.price : null,
          salePrice: item.productId ? item.productId.salePrice : null,
          quantity: item.quantity,
        }));
    
        res.status(200).json({
          success: true,
          data: {
            ...cart._doc,
            items: populateCartItems,
          },
          message : "Product Updated"

        });
        
    } catch (error) {
        res.json({
            success : false,
            message : "error"
        })
    }
}

const delateCart = async(req,res) => {
    try {
        

        const { userId, productId } = req.params;
        if (!userId || !productId) {
          return res.status(400).json({
            success: false,
            message: "Invalid data provided!",
          });
        }
    
        const cart = await Cart.findOne({ userId }).populate({
          path: "items.productId",
          select: "image title price salePrice",
        });
    
        if (!cart) {
          return res.status(404).json({
            success: false,
            message: "Cart not found!",
          });
        }
    
        cart.items = cart.items.filter(
          (item) => item.productId._id.toString() !== productId
        );
    
        await cart.save();
    
        await cart.populate({
          path: "items.productId",
          select: "image title price salePrice",
        });
    
        const populateCartItems = cart.items.map((item) => ({
          productId: item.productId ? item.productId._id : null,
          image: item.productId ? item.productId.image : null,
          title: item.productId ? item.productId.title : "Product not found",
          price: item.productId ? item.productId.price : null,
          salePrice: item.productId ? item.productId.salePrice : null,
          quantity: item.quantity,
        }));
    
        res.status(200).json({
          success: true,
          data: {
            ...cart._doc,
            items: populateCartItems,
          },
        });


    } catch (error) {
        res.json({
            sucess : false,
            message : "error"
        })
    }
}

module.exports={addTOCart,updateCart,delateCart,fetchCart}