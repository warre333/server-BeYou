const express = require("express");
const db = require("../../../middleware/database/database.connection");
const CheckJWT = require("../../../middleware/auth/CheckJWT")

const stripe = require('stripe')('sk_test_51MbMPvBVdpaK1AsGqefv3y85wiNmEH4cq8ZAxok8b4Q2HvAmFHbVaQzyhx9GlvBtdhcBcl0rZ9WIcvd3uAzA3Q5h00hy2bpsvI');

var router = express.Router();

router.get("/", async(req, res) => {
  const { begin_date, end_date, post_id, daily_budget } = req.query

  console.log(begin_date, end_date, post_id, daily_budget, (new Date(end_date).getTime() - new Date(begin_date).getTime()), Math.ceil((new Date(end_date).getTime() - new Date(begin_date).getTime()) /(1000 * 3600 * 24)));
  if(begin_date, end_date, post_id, daily_budget){    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: (daily_budget * Math.ceil((new Date(end_date).getTime() - new Date(begin_date).getTime()) /(1000 * 3600 * 24))) * 100,
      currency: 'usd',
      automatic_payment_methods: {
          enabled: true
      }
    }); 

    db.query("INSERT INTO tbladvertisements(post_id, stripe_id, daily_budget, start_date, end_date) VALUES(?, ?, ?, ?, ?)", [post_id, paymentIntent.id, daily_budget, begin_date, end_date], (err, result) => {
      if(err){
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