const sql = require('mssql');
const LoggerService = require('../middleware/logger');
const logger = new LoggerService("transaction");
require('dotenv').config()

const Transaction = {};

const config = {
    user: process.env.MSSQL_USER,
    password: process.env.MSSQL_PASS,
    server: process.env.MSSQL_SERVER,
    database: process.env.MSSQL_DB,
    port: Number(process.env.MSSQL_PORT),
    encrypt: false
}


Transaction.getAllTransactions = async (req, res, next) => {
      try {
        const account = req.query.account;
        const startDate = new Date(req.query.startDate);
        const endDate = new Date(req.query.endDate);
      
        await sql.connect(config);
        let result;
        if (startDate.getTime() === endDate.getTime()){
          result = await sql.query`SELECT * from settlement_notifications where virtual_acct_no=${account} and created_at >=${startDate}`;
        }else{
          result = await sql.query`SELECT * from settlement_notifications where virtual_acct_no=${account} and created_at >=${startDate} and created_at <=${endDate}`;
        }
       
        return res.status(200).json({
           status: "Success",
           data: result.recordset
        });
      } catch (error) {
          console.log(error);
        return res.status(500).json(error);
      }
};
  
  
module.exports = Transaction;