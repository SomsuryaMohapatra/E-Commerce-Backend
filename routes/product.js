const express = require("express");
const Product = require("../Schema/Product/ProductSchema");
const NewCollections = require("../Schema/NewCollections/NewCollectionsSchema");
const Users = require("../Schema/User/UserSchema");
const jwt = require("jsonwebtoken");
require("dotenv").config;

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

//Middleware for fetching logged in user
const fetchUser = async (req, res, next) => {
  try {
    const token = req.header("token");
    if (!token) {
      res.status(401).send({ error: "Something Went Wrong" });
    } else {
      try {
        const data = jwt.verify(token, process.env.JWT_SALT);
        req.user = data.user;
        next();
      } catch (error) {
        console.log("Error: ", error.message);
        res
          .status(401)
          .send({ error: "Something went wrong with verification" });
      }
    }
  } catch (error) {
    console.log("error: ", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

//Adding product to user cartdata
router.post("/addtocart", fetchUser, async (req, res) => {
  try {
    // console.log("Body: ", req.body, " user: ", req.user);
    let userData = await Users.findOne({ _id: req.user.id });
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );

    res.send("Cart Item Added");
  } catch (error) {
    console.log("Error: ", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

//Fetching cartdata of a logged in user
router.post('/getcart',fetchUser,async(req,res)=>{
  try {
    let userData=await Users.findOne({_id : req.user.id});
    res.json(userData.cartData);
  } catch (error) {
    
  }
})

//Removing product from user cart data
router.post("/removefromcart", fetchUser, async (req, res) => {
  try {
    let userData = await Users.findOne({ _id: req.user.id });
    if (userData.cartData[req.body.itemId] > 0) {
      userData.cartData[req.body.itemId] -= 1;
    }
    await Users.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );
    res.send("Item removed from cart");
  } catch (error) {}
});

module.exports = router;
