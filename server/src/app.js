const express = require("express");
const cors = require("cors");
const api = require("./routes/api")
const app = express();
const path = require("path");
const morgan = require("morgan");

app.use(cors("http://localhost:3000"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(morgan("combined"));

app.use("/v1", api)

app.use("/*", (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});
module.exports = app;
