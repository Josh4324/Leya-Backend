const mysql = require("mysql2/promise");
const fs = require("fs");
const LoggerService = require("../middleware/logger");
const logger = new LoggerService("user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = {};

User.login = async (req, res) => {
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

    const { userId, password } = req.body;

    const [rows, fields] = await connection.execute(
      "SELECT * FROM `user_details` WHERE `user_name` = ?",
      [userId]
    );

    const check = bcrypt.compareSync(password, rows[0].password);

    if (!check) {
      return res.status(200).json({
        status: "Failed",
        message: "Incorrect email or password",
      });
    }

    const token = jwt.sign(rows[0], process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return res.status(200).json({
      status: "Success",
      message: "Login Successfull",
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

User.getUser = async (req, res) => {
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

User.resetPassword = async (req, res, next) => {
  try {
    await sql.connect(config);
    const { newPassword, oldPassword, email } = req.body;

    const result =
      await sql.query`SELECT * from user_details where user_name=${email}`;

    if (!result) {
      return res.status(400).json({ message: "User does not exist" });
    }

    if (oldPassword === result.recordset[0].password) {
      const result2 =
        await sql.query`UPDATE user_details SET password = ${newPassword}, new_user_flag=0 WHERE user_name=${email}`;
    } else {
      return res.status(400).json({
        message: "Wrong password, please enter the correct old password",
      });
    }
    logger.info(
      `Request recieved at /api/v1/user/resetpassword | Request Object - None | Response - ${JSON.stringify(
        {
          status: "Success",
          message: "Password Reset Successfull",
        }
      )}`
    );
    return res.status(200).json({
      status: "Success",
      message: "Password Reset Successfull",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

User.reset = async (req, res, next) => {
  try {
    await sql.connect(config);
    const { newPassword, token } = req.body;
    let payload;
    if (token) {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } else {
      return res
        .status(400)
        .json({ message: "Token has expired or Invalid token" });
    }

    const email = payload.email;

    const result =
      await sql.query`SELECT * from user_details where user_name=${email}`;

    if (!result) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const result2 =
      await sql.query`UPDATE user_details SET password = ${newPassword} WHERE user_name=${email}`;

    return res.status(200).json({
      status: "Success",
      message: "Password Reset Successfull",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

User.adminReset = async (req, res, next) => {
  try {
    await sql.connect(config);
    const { email, newPassword } = req.body;

    const result =
      await sql.query`SELECT * from user_details where user_name=${email}`;

    if (!result) {
      return res.status(400).json({ message: "User does not exist" });
    } else {
      const result2 =
        await sql.query`UPDATE user_details SET password = ${newPassword} WHERE user_name=${email}`;
    }

    return res.status(200).json({
      status: "Success",
      message: "Merchant Password Reset Successfull",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

User.forgotPassword = async (req, res, next) => {
  try {
    await sql.connect(config);
    const { email } = req.body;
    const payload = {
      email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    const emailLink = `http://vps.providusbank.com/vas/#/reset/${token}`;
    let html = `<![CDATA[
      <h3>Password Reset</h3><br>
      <p>Seems like you forgot your password, if this is true, click below to reset your password</p>
      <a href=${emailLink}><button>Reset Password</button></a><br>
      <p>If you did not forget your password you can safely ignore this email.</p>]]>
      `;

    const response = await request.sendMessage(html, email, "Password Reset");

    return res.status(200).json({
      status: "Success",
      message: "Password Reset Message Sent Successfull",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = User;
