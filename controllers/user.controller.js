const sql = require('mssql');
const request = require("../helpers/request");
const LoggerService = require('../middleware/logger');
const logger = new LoggerService("user");
const jwt = require("jsonwebtoken");
require('dotenv').config()

const User = {};

const config = {
    user: process.env.MSSQL_USER,
    password: process.env.MSSQL_PASS,
    server: process.env.MSSQL_SERVER,
    database: process.env.MSSQL_DB,
    port: Number(process.env.MSSQL_PORT),
    encrypt: false
}


User.resetPassword = async (req, res, next) => {
      try {
        await sql.connect(config);
        const {newPassword, oldPassword, email} = req.body;

        const result = await sql.query`SELECT * from user_details where user_name=${email}`;
        
        if (!result){
            return res.status(400).json({message: "User does not exist"});
        }

        if (oldPassword === result.recordset[0].password){
          console.log("correct")
            const result2 = await sql.query`UPDATE user_details SET password = ${newPassword} WHERE user_name=${email}`;
        }else{
            return res.status(400).json({message: "Wrong password, please enter the correct old password"});
        }

        return res.status(200).json({
           status: "Success",
           message: "Password Reset Successfull"
        }); 
      } catch (error) {
        console.log(error)
        return res.status(500).json(error);
      }
};

User.reset = async (req, res, next) => {
  try {
    await sql.connect(config);
    const {newPassword, oldPassword, token} = req.body;
    let payload
    if (token){
      payload = jwt.verify(token,process.env.JWT_SECRET);
    }else{
      return res.status(400).json({message: "Token has expired or Invalid token"});
    }

    const email = payload.email;

    const result = await sql.query`SELECT * from user_details where user_name=${email}`;
    
    if (!result){
        return res.status(400).json({message: "User does not exist"});
    }

    if (oldPassword === result.recordset[0].password){
      console.log("correct")
        const result2 = await sql.query`UPDATE user_details SET password = ${newPassword} WHERE user_name=${email}`;
    }else{
        return res.status(400).json({message: "Wrong password, please enter the correct old password"});
    }

    return res.status(200).json({
       status: "Success",
       message: "Password Reset Successfull"
    }); 
  } catch (error) {
    console.log(error)
    return res.status(500).json(error);
  }
}

  
User.forgotPassword = async (req, res, next) => {
  try {
    await sql.connect(config);
    const {email} = req.body;
    const payload = {
      email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    const emailLink = `http://vps.providusbank.com/vas/#/reset/${token}`;
    let html =  `<![CDATA[
      <h3>Password Reset</h3><br>
      <p>Seems like you forgot your password, if this is true, click below to reset your password</p>
      <a href=${emailLink}><button>Reset Password</button></a><br>
      <p>If you did not forget your password you can safely ignore this email.</p>]]>
      `;
    
    const response = await request.sendMessage(html,email, "Password Reset");

    return res.status(200).json({
       status: "Success",
       message: "Password Reset Message Sent Successfull"
    }); 
  } catch (error) {
    console.log(error)
    return res.status(500).json(error);
  }
};
  
module.exports = User;