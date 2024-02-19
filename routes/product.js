const express = require("express");
const Product = require("../Schema/Product/ProductSchema");

const router = express.Router();

//Add Product
router.post("/addproduct", async (req, res) => {
  try {
    let products = await Product.find({});
    let productId;
    if (products.length > 0) {
      let lastProductArray = products.slice(-1);
      let lastProduct = lastProductArray[0];
      productId = lastProduct.id + 1;
    } else {
      productId = 1;
    }
    const product = new Product({
      id: productId,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
    });
    console.log(product);

    await product.save();

    console.log("Product Saved");
    res.json({
      success: true,
      name: req.body.name,
    });
  } catch (error) {
    console.log("Error", error.message);
    res.status(500).send("Internal Server Error");
  }
});

//Remove Product
router.delete("/removeproduct", async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log("Removed");
    res.json({
      success: true,
      name: req.body.name,
    });
  } catch (error) {}
});

module.exports = router;
