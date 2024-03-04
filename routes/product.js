const express = require("express");
const Product = require("../Schema/Product/ProductSchema");
const NewCollections = require("../Schema/NewCollections/NewCollectionsSchema");

const router = express.Router();

//POST Product
router.post("/addproduct", async (req, res) => {
  try {
    let products = await Product.find({});
    let newCollectionProducts = await NewCollections.find({});
    let productId, lastProductId, lastNewCollectionProductId;
    if (products.length > 0) {
      let lastProductArray = products.slice(-1);
      let lastProduct = lastProductArray[0];
      lastProductId = lastProduct.id;
    }
    if (products.length <= 0) {
      lastProductId = 0;
    }
    if (newCollectionProducts.length > 0) {
      let lastNewCollectionProductArray = newCollectionProducts.slice(-1);
      let lastNewCollectionProduct = lastNewCollectionProductArray[0];
      lastNewCollectionProductId = lastNewCollectionProduct.id;
    }
    if (newCollectionProducts.length <= 0) {
      lastNewCollectionProductId = 0;
    }
    if (lastProductId > lastNewCollectionProductId) {
      productId = lastProductId + 1;
    }
    if (lastProductId < lastNewCollectionProductId) {
      productId = lastNewCollectionProductId + 1;
    }
    if (newCollectionProducts.length === 0 && products.length === 0) {
      productId = 1;
    }
    console.log("Product Id: ", productId);
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

    // console.log("Product Saved");
    res.json({
      success: true,
      product: product,
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
