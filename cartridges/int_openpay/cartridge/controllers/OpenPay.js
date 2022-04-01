"use strict";

const server = require("server");
const OpenPay = require("~/cartridge/scripts/openpay/helpers/openpayApi");

server.use("prueba", (req, res, next) => {
  const body = {
    card_number: "4111111111111111",
    holder_name: "Juan Perez Ramirez",
    expiration_year: "23",
    expiration_month: "12",
    cvv2: "110",
    address: {
      city: "Querétaro",
      country_code: "MX",
      postal_code: "76900",
      line1: "Av 5 de Febrero",
      line2: "Roble 207",
      line3: "col carrillo",
      state: "Queretaro",
    },
  };
  const token = OpenPay.rest("/tokens", "POST", body);

  res.json({
    token: token,
  });
  next();
});

module.exports = server.exports();
