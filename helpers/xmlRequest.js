const xml = {};

xml.SendMessage = (message, rec, sub) => {
   return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:prov="http://providus.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <prov:sendEmail>
         <!--Optional:-->
         <message>${message}</message>
         <!--Optional:-->
         <recipient>${rec}</recipient>
         <!--Optional:-->
         <subject>${sub}</subject>
         <!--Optional:-->
         <message_type>?</message_type>
         <!--Optional:-->
         <account_no>?</account_no>
      </prov:sendEmail>
   </soapenv:Body>
</soapenv:Envelope>`;
};




module.exports = xml;
