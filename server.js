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

//schema for users
const usersSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    role: String,
  },
  { timestamps: true }
);

//schema for blog posts
const postsSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    category: String,
    image: String,
    author: String,
  },
  { timestamps: true }
);

const subscriptionSchema = new mongoose.Schema(
  {
    email: String,
  },
  { timestamps: true }
);

//models for mongoose schemas
const User = mongoose.model("User", usersSchema, "users");
const BlogPost = mongoose.model("BlogPost", postsSchema, "posts");
const Subscription = mongoose.model(
  "Subscription",
  subscriptionSchema,
  "subscriptions"
);

app.post("/api/upload", async (req, res) => {
  if (!req.files || !req.files.postImage) {
    return res.status(400).send("No file uploaded.");
  }
  try {
    const uploadedFile = req.files.postImage;

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

//register new user
app.post("/api/user/register", async (req, res) => {
  const registrationData = req.body;

  if (
    registrationData.firstName === null ||
    registrationData.firstName === ""
  ) {
    return res.status(400).send("First name cannot be empty");
  }
  if (registrationData.lastName === null || registrationData.lastName === "") {
    return res.status(400).send("Last name cannot be empty");
  }
  if (registrationData.email === null || registrationData.email === "") {
    return res.status(400).send("Email cannot be empty");
  }
  if (registrationData.password === null || registrationData.password === "") {
    return res.status(400).send("Password cannot be empty");
  }

  try {
    const existingUser = await User.findOne({ email: registrationData.email });

    if (existingUser) {
      return res.status(400).send("Email already exists");
    }

    bcrypt.hash(registrationData.password, saltRounds, async (err, hash) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal server error");
      }

      registrationData.password = hash;

      const newUser = new User({
        firstName: registrationData.firstName,
        lastName: registrationData.lastName,
        email: registrationData.email,
        password: registrationData.password,
        role: "user",
      });

      await newUser.save();
      res.status(200).json({ message: "Registration successful" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

// login user
app.post("/api/user/login", async (req, res) => {
  const loginData = req.body;

  if (loginData.email === null || loginData.email === "") {
    return res.status(400).send("Email cannot be empty");
  }
  if (loginData.password === null || loginData.password === "") {
    return res.status(400).send("Password cannot be empty");
  }

  try {
    const existingUser = await User.findOne({ email: loginData.email });

    if (!existingUser) {
      return res.status(400).send("Email does not exist");
    }

    bcrypt.compare(loginData.password, existingUser.password, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal server error");
      }

      if (result) {
        return res
          .status(200)
          .json({ message: "Login successful", user: String(existingUser.id) });
      } else {
        return res.status(400).send("Incorrect password");
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

// get user data
app.get("/api/user/:id", async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid id format");
  }

  try {
    const userData = await User.findById(id).select("-password");
    if (!userData) {
      return res.status(400).send("User does not exist");
    }
    res.status(200).json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

//update user data
app.put("/api/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const userData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid id format");
    }

    if (
      !userData.firstName ||
      !userData.lastName ||
      !userData.email ||
      !userData.role
    ) {
      return res.status(400).send("All fields are required");
    }

    const existingUser = await User.findById(id).select("-password");
    if (!existingUser) {
      return res.status(404).send("User not found");
    }

    existingUser.firstName = userData.firstName;
    existingUser.lastName = userData.lastName;
    existingUser.email = userData.email;
    existingUser.role = userData.role;

    await existingUser.updateOne(existingUser);
    res.status(200).json({ message: "User data updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

//delete user
app.delete("/api/user/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid id format");
    }

    const existingUser = await User.findById(id).select("-password");
    if (!existingUser) {
      return res.status(404).send("User not found");
    }

    await existingUser.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

//get users
app.get("/api/users", async (req, res) => {
  const page = +req.query.page || 1;
  const perPage = +req.query.perPage || 10;

  try {
    const totalUsers = await User.countDocuments();
    const users = await User.find()
      .select("-password")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).json({ users, total: totalUsers });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

//create blog post
app.post("/api/post/add", async (req, res) => {
  const postData = req.body;

  if (postData.title === null || postData.title === "") {
    return res.status(400).send("Title cannot be empty");
  }
  if (postData.description === null || postData.description === "") {
    return res.status(400).send("Description cannot be empty");
  }
  if (postData.category === null || postData.category === "") {
    return res.status(400).send("Category cannot be empty");
  }
  if (postData.image === null || postData.image === "") {
    return res.status(400).send("Image cannot be empty");
  }
  if (postData.author === null || postData.author === "") {
    return res.status(400).send("Author cannot be empty");
  }

  try {
    const newPost = new BlogPost({
      title: postData.title,
      description: postData.description,
      category: postData.category,
      image: postData.image,
      author: postData.author,
    });

    await newPost.save();
    res.status(200).json({ message: "Post created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

//update blog post

app.put("/api/post/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const postData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid id format");
    }

    if (
      !postData.title ||
      !postData.description ||
      !postData.category ||
      !postData.image ||
      !postData.author
    ) {
      return res.status(400).send("All fields are required");
    }

    const existingPost = await BlogPost.findById(id);
    if (!existingPost) {
      return res.status(404).send("Post not found");
    }

    existingPost.title = postData.title;
    existingPost.description = postData.description;
    existingPost.category = postData.category;
    existingPost.image = postData.image;
    existingPost.author = postData.author;

    await existingPost.updateOne(existingPost);
    res.status(200).json({ message: "Post updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

//delete blog post
app.delete("/api/post/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid id format");
    }

    const existingPost = await BlogPost.findById(id);
    if (!existingPost) {
      return res.status(404).send("Post not found");
    }

    await existingPost.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

//get posts
app.get("/api/posts", async (req, res) => {
  const page = +req.query.page || 1;
  const perPage = +req.query.perPage || 10;

  try {
    const totalPosts = await BlogPost.countDocuments();
    const posts = await BlogPost.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).json({ posts, total: totalPosts });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

//get post by id
app.get("/api/post/:id", async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid id format");
  }

  try {
    const postData = await BlogPost.findById(id);
    if (!postData) {
      return res.status(400).send("Post does not exist");
    }
    res.status(200).json(postData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

//get post by category name
app.get("/api/posts/:category", async (req, res) => {
  const category = req.params.category;
  const page = +req.query.page || 1;
  const perPage = +req.query.perPage || 10;

  try {
    const totalPosts = await BlogPost.countDocuments({
      category: category,
    });

    const posts = await BlogPost.find({ category: category })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).json({ posts, total: totalPosts });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

//add subscription email via url query
app.get("/api/subscribe/:email", async (req, res) => {
  const email = req.params.email;

  if (email === null || email === "") {
    return res.status(400).send("Email cannot be empty");
  }

  try {
    const result = await Subscription.findOne({ email: email });

    if (result) {
      return res.status(400).send("Email already exists");
    }

    const newSubscription = new Subscription({
      email: email,
    });

    await newSubscription.save();

    res.status(200).json({ message: "Subscription successful" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

// run server
const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
