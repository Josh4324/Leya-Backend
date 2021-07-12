const axios = require('axios');
const xml = require("./xmlRequest");
const parser = require('xml2js').parseString;

const Helpers = {};

Helpers.SendRequest = (method, url, data, headers) => {
    try {
        return  axios({ method, url, data, headers });
    }catch(err){
        return err;
    }
};

const xmlParser = (xml, method) => {
    const obj = [];
    parser(xml, (err, result) => {
      //console.log({ xml });
      let d = result['S:Envelope']['S:Body'][0]["ns2:sendEmailResponse"]
      console.log(d[0].return[0]);
      obj.push(d[0].return[0]);
      if (err) console.log(err);
      return err;
    });
    return obj;
};

Helpers.sendMessage = async (message, rec, sub) => {
    try {
      const request = await xml.SendMessage(message, rec, sub);
      const response = await axios.post(process.env.EMAIL_WSDL, request, {
        timeout: 60 * 3 * 1000,
        headers: { 'Content-Type': 'text/xml' },
      });
      const { data } = response;
      return xmlParser(data, 'ns2:sendEmailResponse');
    } catch (error) {
      console.log(error);
    }
};





module.exports = Helpers;
