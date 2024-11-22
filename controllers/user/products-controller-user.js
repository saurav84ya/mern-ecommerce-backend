const Product = require("../../models/Product");

const getFilteredProducts = async (req, res) => {
  try {
    const { category, brand, sort = "price-lowtohigh" } = req.query;

    console.log("Category:", category);
    console.log("Brand:", brand);
    console.log("Sort:", sort);

    let filter = {};
    if (category) filter.category = { $in: category.split(",") };
    if (brand) filter.brand = { $in: brand.split(",") };

    const sortOptions = {
      "price-lowtohigh": { price: 1 },
      "price-hightolow": { price: -1 },
    };

    const selectedSort = sortOptions[sort] || sortOptions["price-lowtohigh"];
    console.log("Selected Sort:", selectedSort);

    const products = await Product.find(filter).sort(selectedSort);

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error in getFilteredProducts:", error);
    res.status(500).json({ success: false, message: "An error occurred." });
  }
};

module.exports = { getFilteredProducts };
