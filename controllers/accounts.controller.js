const sql = require("mssql");
const LoggerService = require("../middleware/logger");
const logger = new LoggerService("accounts");
require("dotenv").config();

const Account = {};

const config = {
  user: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASS,
  server: process.env.MSSQL_SERVER,
  database: process.env.MSSQL_DB,
  port: Number(process.env.MSSQL_PORT),
  encrypt: false
};

Account.getAllAccounts = async (req, res) => {
  try {
    const merchantId = req.query.merchantId || 1;
    const page = req.query.page || 1;
    const search = req.query.search || "";
    const searchValue = req.query.searchValue || "";
    let offset = 0;
    if (page < 2) {
      offset = 0;
    } else {
      offset = page * 20;
    }
    await sql.connect(config);
    let result;

    if (merchantId === 1) {
      if (search) {
        result = await sql.query(
          `SELECT * from virtual_accounts where ${search} LIKE '%${searchValue}%'`
        );
        console.log(result);
      } else {
        result =
          await sql.query`SELECT * from virtual_accounts ORDER BY id OFFSET ${offset} ROWS FETCH NEXT 20 ROWS ONLY`;
      }
    } else {
      if (search) {
        result = await sql.query(
          `SELECT * from virtual_accounts where ${search} LIKE '%${searchValue}%'and merchant_id = ${merchantId}`
        );
      } else {
        result =
          await sql.query`SELECT * from virtual_accounts where merchant_id = ${merchantId} ORDER BY id OFFSET ${offset} ROWS FETCH NEXT 20 ROWS ONLY`;
      }
    }
    logger.info(
      `Request recieved at /api/v1/accounts | Request Object - ${JSON.stringify(
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
      `Request recieved at /api/v1/accounts | Request Object - ${
        req.body
      } | Response - ${JSON.stringify({ error })}`
    );
    return res.status(500).json(error);
  }
};

module.exports = Account;
