const Product = require("../../models/Product");

const getFilteredProducts = async (req, res) => {
  try {
    const { category, brand, sort = "price-lowtohigh" } = req.query;
    let filter = {};
    if (category) filter.category = { $in: category.split(",") };
    if (brand) filter.brand = { $in: brand.split(",") };

    const sortOptions = {
      "price-lowtohigh": { price: 1 },  // Ascending order by price
      "price-hightolow": { price: -1 }, // Descending order by price
      "atoz": { name: 1 },              // Alphabetical order (A to Z) by name
      "ztoa": { name: -1 },             // Reverse alphabetical order (Z to A) by name
    };
    
    const selectedSort = sortOptions[sort] || sortOptions["price-lowtohigh"];

    const products = await Product.find(filter).sort(selectedSort);

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    // console.error("Error in getFilteredProducts:", error);
    res.status(500).json({ success: false, message: "An error occurred." });
  }
};



const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch product from the database
    const prod_uct = await Product.findById(id);
    if (!prod_uct)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    // Calculate the average review rating
    const totalRatings = prod_uct.reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageReview = prod_uct.reviews.length > 0
      ? (totalRatings / prod_uct.reviews.length).toFixed(1) // Round to 1 decimal place
      : 0;

    // Attach the dynamically calculated averageReview
    const product = {
      ...prod_uct.toObject(),
      averageReview: Number(averageReview),
    };


    // console.log("product",product)

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};




// const getProductDetails = async (req,res) => {
//   try {
//     const {id} = req.params
//     const product = await Product.findById(id)
//     if(!product) return res.status(404).json({
//       success : true,
//       message :"product not found"
//     })


//     console.log('product',product)
 
//     res.status(200).json({
//       success : true ,
//       data : product
//     })
//   } catch (error) {
//     //(error)
//     res.status(500).json({
//       success : false ,
//       message : "some error occured"
//     })
//   }
// }

module.exports = { getFilteredProducts ,getProductDetails };
