const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const morgan = require("morgan");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

// MongoDB URI - Fallback to a default if not found in environment variables
const mongoURI = process.env.ATLAS_URI || "mongodb://localhost:27017/quizapp";

// MongoDB connection with error handling
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connection established successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

// Routes
const userRouter = require("./routes/user");
const testRouter = require("./routes/test");

app.use("/api/user", userRouter);
app.use("/api/test", testRouter);

// Production/staging environment setup
if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging") {
  app.use(express.static("client/build"));

  // Handle any requests that don’t match the above routes
  app.all("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

// Start server
app.listen(port, () => console.log(`Server listening on port ${port}`));
