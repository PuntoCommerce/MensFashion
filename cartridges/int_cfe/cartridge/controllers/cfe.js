"use strict";

const server = require("server");
const CFE = require("~/cartridge/scripts/cfe/helpers/cfeTokenHelper");

server.post("CreateToken", (req, res, next) => {
  try {
    const { name, cardNumber, cvv} = req.form;

    const body = {
      card_number: cardNumber,
      holder_name: name,
      cvv2: cvv,
    };
    const response = CFE.rest("/api/tokens", "POST", body);
    var Logger = require('dw/system/Logger');
    Logger.error('AUTHTOKENbbb---->{0}',JSON.stringify(response));

    res.json({ cfe: response });
  } catch (error) {
    const err = error;
    res.json({ error: err });
  }
  next();
});

module.exports = server.exports();
