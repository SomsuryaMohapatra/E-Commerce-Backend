const express = require("express");
const Product = require("../Schema/Product/ProductSchema");

const router = express.Router();

//POST Product
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
    // console.log(product);

    await product.save();

    // console.log("Product Saved");
    res.json({
      success: true,
      name: req.body.name,
    });
  } catch (error) {
    console.log("Error", error.message);
    res.status(500).send("Internal Server Error");
  }
});

//DELETE Product
router.delete("/removeproduct", async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log("Removed");
    res.json({
      success: true,
      name: req.body.name,
    });
  } catch (error) {
    console.log("Error", error.message);
    res.status(500).send("Internal Server Error");
  }
});

//GET Products
router.get("/allproducts", async (req, res) => {
  try {
    let products = await Product.find({});
    if (products.length > 0) {
      // console.log("All Products Fetched");
      res.json({
        success: true,
        products: products,
      });
    } else {
      // console.log("No Product Available");
      res.json({
        success: false,
        products: "No Products Available",
      });
    }
  } catch (error) {
    console.log("Error", error.message);
    res.status(500).send("Internal Server Error");
  }
});

//GET Popular in Women
router.get("/popularinwomen", async (req, res) => {
  try {
    let products = await Product.find({ category: "women" });
    if (products) {
      let popularInWomen = products.slice(-4);
      if (popularInWomen) {
        res.json({
          status: true,
          popular_in_women: popularInWomen,
        });
      }
    }
  } catch (error) {}
});

module.exports = router;
