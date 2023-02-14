const express = require("express");
const db = require("../../../middleware/database/database.connection");
const CheckJWT = require("../../../middleware/auth/CheckJWT")

const stripe = require('stripe')('sk_test_51MbMPvBVdpaK1AsGqefv3y85wiNmEH4cq8ZAxok8b4Q2HvAmFHbVaQzyhx9GlvBtdhcBcl0rZ9WIcvd3uAzA3Q5h00hy2bpsvI');

var router = express.Router();

router.get("/", async(req, res) => {
  const { begin_date, end_date, amount } = req.query
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd', 
          product_data: {
            name: 'Advertisement'
          }, 
          unit_amount: 2000
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'http://localhost:3000/success.html', // Give query again
    cancel_url: 'http://localhost:3000/cancel.html',
  });

  res.json({success: true, data: session})
})

module.exports = router;