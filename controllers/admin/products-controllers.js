const { ImageUploadUtils } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");
const User = require("../../models/User");

const handleImageUpload = async (req, res) => {
    try {
        const result = await ImageUploadUtils(req.file.buffer); // Directly pass the file buffer
        res.json({
            success: true,
            result
        });
    } catch (error) {
        //("error at handleImageUpload");
        res.json({
            success: false,
            message: "Error at handleImageUpload"
        });
    }
};


const addProduct = async (req, res) => {
    try {
      const { image,title,description,category, brand,
        price,salePrice, totalStock,averageReview} = req.body;

  
  
      const newlyCreatedProduct = new Product({
        image,title,description,category, brand,
        price,salePrice, totalStock,
      });
  
      await newlyCreatedProduct.save();
      res.status(201).json({
        success: true,
        message :"Product Added sucesfully" ,
        data: newlyCreatedProduct,
      });
    } catch (e) {
      //(e);
      res.status(500).json({
        success: false,
        message :"something went wrong plz Try" ,
        message: "Error occured",
      });
    }
  };

  const fetchAllProducts = async (req, res) => {
    try {
      const listOfProducts = await Product.find({});
      res.status(200).json({
        success: true,
        data: listOfProducts,
      });
    } catch (e) {
      //(e);
      res.status(500).json({
        success: false,
        message: "Error occured",
      });
    }
  };
  

  const editProduct = async (req, res) => {
    //("hii edit")
    try {
      const { id } = req.params;
      const { image,title,description, category,brand,
        price, salePrice, totalStock,
      } = req.body;
  
      let findProduct = await Product.findById(id);
      if (!findProduct)
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
  
      findProduct.title = title || findProduct.title;
      findProduct.description = description || findProduct.description;
      findProduct.category = category || findProduct.category;
      findProduct.brand = brand || findProduct.brand;
      findProduct.price = price === "" ? 0 : price || findProduct.price;
      findProduct.salePrice =
        salePrice === "" ? 0 : salePrice || findProduct.salePrice;
      findProduct.totalStock = totalStock || findProduct.totalStock;
      findProduct.image = image || findProduct.image;
  
      await findProduct.save();
      res.status(200).json({
        success: true,
        data: findProduct,
      });
    } catch (e) {
      //(e);
      res.status(500).json({
        success: false,
        message: "Error occured",
      });
    }
  };

  const deleteProduct = async (req, res) => {
    //("hii")
    try {
      const { id } = req.params;
      const product = await Product.findByIdAndDelete(id);
  
      if (!product)
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
  
      res.status(200).json({
        success: true,
        message: "Product delete successfully",
      });
    } catch (e) {
      //(e);
      res.status(500).json({
        success: false,
        message: "Error occured",
      });
    }
  };

  const fetchUsers = async (req,res) => {
    try {
      const users = await User.find({})
      res.json({
        success : true ,
        data : users
      })
      
    } catch (error) {
      res.json({
        success:false,
        message : "Users not found"
      })
    }
  }



module.exports = { handleImageUpload ,addProduct , fetchAllProducts ,editProduct ,deleteProduct ,fetchUsers };

