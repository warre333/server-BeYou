const express = require("express");
const db = require("../../../middleware/database/database.connection");

const stripe = require('stripe')('pk_test_51MbMPvBVdpaK1AsGhgl5HaCkeHIC7x8gQzc9ODQ1BboTArVxGzCRcMmmzxU17xvut3PiybGcMdkZqYWgmbaUBHcP00mSnEIYgc');

var router = express.Router();

router.post("/", async(req, res) => {
  const { post_id, budget } = req.body

  if(post_id && budget){  
    if(budget > 10000){
      res.json({success: false, message: "You can not spend more than €10.000 on an advertisement."})
      return
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: budget * 100,
      currency: 'usd',
      automatic_payment_methods: {
          enabled: true
      }
    }); 

    console.log(paymentIntent)

    db.query("INSERT INTO tbladvertisements(post_id, stripe_id, budget) VALUES(?, ?, ?)", [post_id, paymentIntent.id, budget * 100], (err, result) => {
      if(err){
        console.log(err)
        res.json({success: false, message: err})
      } else {
        res.json({success: true, data: paymentIntent.client_secret})
      }
    })
  } else {
    res.json({success: false, message: "You should provide all the required data."})
  }
})

module.exports = router;