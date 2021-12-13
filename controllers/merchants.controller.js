const sql = require("mssql");
const LoggerService = require("../middleware/logger");
const logger = new LoggerService("merchant");
require("dotenv").config();

const Merchant = {};

const config = {
  user: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASS,
  server: process.env.MSSQL_SERVER,
  database: process.env.MSSQL_DB,
  port: Number(process.env.MSSQL_PORT),
  encrypt: false
};

Merchant.getAllMerchants = async (req, res, next) => {
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * from merchants`;
    logger.info(
      `Request recieved at /api/v1/merchants | Request Object - ${JSON.stringify(
        req.body
      )} | Response - ${JSON.stringify({
        status: "Success",
        data: result.recordset
      })}`
    );
    return res.status(200).json({
      status: "Success",
      data: result.recordset
    });
  } catch (error) {
    logger.error(
      `Request recieved at /api/v1/merchants | Request Object - ${JSON.stringify(
        req.body
      )} | Response - ${JSON.stringify({
        status: "Failed",
        error
      })}`
    );
    return res.status(500).json(error);
  }
};

Merchant.AddMerchant = async (req, res) => {
  try {
    await sql.connect(config);
    const { merchantId, email } = req.body;
    console.log(merchantId);

    const user =
      await sql.query`SELECT * from user_details where user_name=${email}`;

    const updatedUser = user.recordset[0].merchant_id + "," + merchantId;
    await sql.query`UPDATE user_details SET merchant_id = ${updatedUser} WHERE user_name = ${email}`;
    logger.info(
      `Request recieved at /api/v1/merchants | Request Object - ${JSON.stringify(
        req.body
      )} | Response - ${JSON.stringify({
        status: "Success",
        message: "User updated successfully"
      })}`
    );

    return res.status(200).json({
      status: "Success",
      message: "User updated successfully"
    });
  } catch (error) {
    logger.error(
      `Request recieved at /api/v1/merchants | Request Object - ${JSON.stringify(
        req.body
      )} | Response - ${JSON.stringify({
        status: "Failed",
        error
      })}`
    );
    return res.status(500).json(error);
  }
};

module.exports = Merchant;
