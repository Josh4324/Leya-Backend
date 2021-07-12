const sql = require('mssql');
const LoggerService = require('../middleware/logger');
const logger = new LoggerService("merchant");
require('dotenv').config()

const Merchant = {};

const config = {
    user: process.env.MSSQL_USER,
    password: process.env.MSSQL_PASS,
    server: process.env.MSSQL_SERVER,
    database: process.env.MSSQL_DB,
    port: Number(process.env.MSSQL_PORT),
    encrypt: false
}


Merchant.getAllMerchants = async (req, res, next) => {
      try {
        await sql.connect(config);
        const result = await sql.query`SELECT * from merchants`;
        return res.status(200).json({
           status: "Success",
           data: result.recordset
        });
      } catch (error) {
          console.log(error);
        return res.status(500).json(error);
      }
};
  
  
module.exports = Merchant;