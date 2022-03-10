const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const routes = require("./routes/index.routes");
const mysql = require("mysql2");
const fs = require("fs");
require("dotenv").config();

app.use(morgan("common"));
app.use(cors());
app.use(helmet());
app.set("trust proxy", 1);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use(express.urlencoded({ extended: false, limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));

app.use("/", routes);

app.use(function (req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(function errorHandler(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500).json({ error: res.locals.message });
});

const port = process.env.PORT || 4200;

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB,
  connectTimeout: 30000,
  port: 25060,
  ssl: {
    // DO NOT DO THIS
    // set up your ca correctly to trust the connection
    ca: fs.readFileSync(__dirname + "/ca-certificate.crt"),
  },
});

connection.query("SELECT 1 + 1 AS solution", function (error, results, fields) {
  if (error) throw error;
  console.log("Database connected");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
