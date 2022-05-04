"use strict";

const server = require("server");
const OpenPay = require("~/cartridge/scripts/openpay/helpers/openpayApi");

server.post("CreateToken", (req, res, next) => {
  try {
    const { name, cardNumber, cvv, month, year } = req.form;

    const body = {
      card_number: cardNumber,
      holder_name: name,
      expiration_year: year,
      expiration_month: month,
      cvv2: "110",
    };

    const response = OpenPay.rest("/tokens", "POST", body);

    res.json({ openpay: response });
  } catch (error) {
    const err = error;
    res.json({ error: err });
  }
  next();
});

module.exports = server.exports();
