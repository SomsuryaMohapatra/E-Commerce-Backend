const express = require("express");
const NewCollections = require("../Schema/NewCollections/NewCollectionsSchema");
const Product = require("../Schema/Product/ProductSchema");

const router = express.Router();

//endpoint for adding new collections product
router.post("/addnewcollections", async (req, res) => {
  try {
    let newCollectionProducts = await NewCollections.find({});
    let newCollectionProductId;
    if (newCollectionProducts.length > 0) {
      let lastNewCollectionProductArray = newCollectionProducts.slice(-1);
      let lastNewCollectionProduct = lastNewCollectionProductArray[0];
      newCollectionProductId = lastNewCollectionProduct.id + 1;
    } else {
      newCollectionProductId = 1;
    }

    const newProduct = NewCollections({
      id: newCollectionProductId,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
    });

    await newProduct.save();

    res.json({
      success: true,
      new_product_name: req.body.name,
    });
  } catch (error) {
    console.log("Error", error.message);
    res.status(500).send("Internal Server Error");
  }
});

//endpoint for fetching new collections
router.get("/newcollections", async (req, res) => {
  try {
    let newCollectionsProducts = await NewCollections.find({});
    if (newCollectionsProducts.length > 0) {
      res.json({
        success: true,
        new_collections_products: newCollectionsProducts,
      });
    } else {
      res.json({
        success: false,
        new_collections_products: "No Products Found",
      });
    }
  } catch (error) {
    console.log("Error: ", error.message);
    res.status(500).send("Internal Server Error");
  }
});

//endpoint for remove product from new collection and save to basic product
router.delete("/removenewcollection", async (req, res) => {
  try {
    let new_product = await NewCollections.findOne({ id: req.body.id });
    let result = await NewCollections.findOneAndDelete({ id: req.body.id });
    if (result) {
      if (new_product) {
        let products = await Product.find({});
        let lastProductArray = products.slice(-1);
        let lastProduct = lastProductArray[0];
        let productId = lastProduct.id + 1;
        let product = new Product({
          id: productId,
          name: new_product.name,
          image: new_product.image,
          category: new_product.category,
          new_price: new_product.new_price,
          old_price: new_product.old_price,
        });

        await product.save();

        res.json({
          success: true,
          status: "Removed from new collections & added to product collection",
          name: new_product.name,
        });
      }
    }
  } catch (error) {
    console.log("Error: ", error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
