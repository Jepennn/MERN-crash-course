import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Product from "./models/product.model.js";

dotenv.config();

const app = express();

app.use(express.json()); //allows us to accept json data in the body(midleware)

app.post("/api/products", async (req, res) => {
  const product = req.body; //user will send this data

  if (!product.name || !product.price || !product.image) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  const newProduct = new Product(product);

  try {
    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.log("Error in creating product:", error.message);
    res.status(500).json({ message: "server error" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params; //id of the product to be deleted

  try {
    await Product.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error in deleting product:", error.message);
    res.status(500).json({ message: "server error" });
  }
});

app.listen(5001, () => {
  connectDB();
  console.log("Server started at http://localhost:5001");
});
