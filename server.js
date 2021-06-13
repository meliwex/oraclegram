const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const compression = require("compression");
const Post = require("./api/models/Post");
const User = require("./api/models/User");
const routes = require("./api/routes/routes");

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(compression());

// Connecting to the server
mongoose
  .connect(
    process.env.MONGODB.replace("<password>", process.env.MONGODB_PASSWORD),
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  )
  .then(() => console.log("Connected to the server..."))
  .catch((err) => console.log(err));

// Routes
routes(app);

// front-end (needed for deploying to heroku)
app.use(express.static(path.join(__dirname, "/client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

// if route not found
app.use((req, res) =>
  res.status(404).send({ message: req.originalUrl + " not found " })
);
const port = process.env.PORT || 3005;
app.listen(port);
