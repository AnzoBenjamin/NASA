const express = require("express");
const cors = require("cors");
const api = require("./routes/api")
const app = express();
const path = require("path");
const morgan = require("morgan");

const FRONTEND_DIR = path.join(__dirname, "..", "..", "client" , "build")

app.use(cors("http://localhost:3000"));
app.use(express.json());
app.use(express.static(FRONTEND_DIR));
app.use(morgan("combined"));

app.use("/v1", api)
// Serve the frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});
module.exports = app;
