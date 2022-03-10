const mysql = require("mysql2/promise");
const fs = require("fs");
const LoggerService = require("../middleware/logger");
const logger = new LoggerService("user");
require("dotenv").config();

const Loan = {};

Loan.getLoans = async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASS,
      database: process.env.MYSQL_DB,
      connectTimeout: 30000,
      port: 25060,
      ssl: {
        // DO NOT DO THIS
        // set up your ca correctly to trust the connection
        ca: fs.readFileSync(__dirname + "/../ca-certificate.crt"),
      },
    });

    const [rows, fields] = await connection.execute(
      "SELECT * FROM `loan_master_table`"
    );

    return res.status(200).json({
      status: "Success",
      data: rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

Loan.getLoan = async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASS,
      database: process.env.MYSQL_DB,
      connectTimeout: 30000,
      port: 25060,
      ssl: {
        // DO NOT DO THIS
        // set up your ca correctly to trust the connection
        ca: fs.readFileSync(__dirname + "/../ca-certificate.crt"),
      },
    });

    const { user_name } = req.payload;

    const [rows, fields] = await connection.execute(
      "SELECT id,user_name, name, user_type FROM `user_details` WHERE `user_name` = ?",
      [user_name]
    );
    return res.status(200).json({
      status: "Success",
      data: rows,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(error);
  }
};

module.exports = Loan;
