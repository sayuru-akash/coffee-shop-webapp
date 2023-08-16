require("dotenv").config();

const http = require("http");
const hostname = "127.0.0.1";
const port = 3000;

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const fileupload = require("express-fileupload");
const fs = require("fs");
app.use(fileupload({ useTempFiles: true }));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET,
});

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_URL);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

// mongoose connection to MongoDB
const mongoURI = process.env.MONGO_URI;
const mongoose = require("mongoose");
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.DB_NAME,
  })
  .then(() =>
    console.log("Connected to MongoDB database: " + process.env.DB_NAME)
  )
  .catch((err) =>
    console.error("Could not connect to MongoDB database...", err)
  );

// mongoose schema for user
const usersSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    password: String,
  },
  { timestamps: true }
);
const productSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    description: String,
    image: String,
    category: String,
  },
  { timestamps: true }
);

//models for mongoose schemas
const User = mongoose.model("User", usersSchema, "users");
const Product = mongoose.model("Product", productSchema, "products");

// routes
app.get("/", (req, res) => {
  res.send("This is the backend server for the cafe app.");
});

app.post("/api/upload", async (req, res) => {
  if (!req.files || !req.files.itemImage) {
    return res.status(400).send("No file uploaded.");
  }
  try {
    const uploadedFile = req.files.itemImage;

    const fileSize = uploadedFile.size;
    if (fileSize > 10485760) {
      return res.status(400).send("File size cannot exceed 10MB");
    }

    const tempPath = uploadedFile.tempFilePath;

    await cloudinary.uploader.upload(tempPath, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error uploading image");
      }

      const imageUrl = result.secure_url;
      fs.unlinkSync(tempPath);
      res.status(200).json({ imageUrl: imageUrl });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error uploading image");
  }
});

app.post("/api/user/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).send("User already exists!");
    }

    const hash = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hash,
    });

    await newUser.save();
    res.status(200).json({ msg: "User successfully created!" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error registering new user please try again.");
  }
});

app.post("/api/user/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(409).send("User does not exist!");
    }

    const match = await bcrypt.compare(password, existingUser.password);

    if (!match) {
      return res.status(401).send("Invalid credentials!");
    }

    res.status(200).json({ id: existingUser._id, msg: "User logged in!" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error logging in user please try again.");
  }
});

// add product
app.post("/api/product/add", async (req, res) => {
  const { name, price, description, image, category } = req.body;

  if (!name || !price || !description || !image || !category) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const newProduct = new Product({
      name,
      price,
      description,
      image,
      category,
    });

    await newProduct.save();
    res.status(200).json({ msg: "Product successfully created!" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating new product please try again.");
  }
});

// update product
app.put("/api/product/update/:id", async (req, res) => {
  const { name, price, description, image, category } = req.body;
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "No product found with that id" });
  }

  if (!name || !price || !description || !image || !category) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    await Product.updateOne(
      { _id: id },
      { name, price, description, image, category }
    );
    res.status(200).json({ msg: "Product successfully updated!" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error updating product please try again.");
  }
});

// delete product
app.delete("/api/product/delete/:id", async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "No product found with that id" });
  }

  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({ msg: "Product successfully deleted!" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error deleting product please try again.");
  }
});

// get all products
app.get("/api/products", async (req, res) => {
  const page = +req.query.page || 1;
  const perPage = +req.query.limit || 10;

  try {
    const products = await Product.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    const count = await Product.countDocuments();

    res.status(200).json({ products, total: count });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting products please try again.");
  }
});

// deploy server
const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
