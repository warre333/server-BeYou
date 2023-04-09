const express = require("express");
const db = require("../../../middleware/database/database.connection");

const stripe = require('stripe')('sk_test_51MbMPvBVdpaK1AsGqefv3y85wiNmEH4cq8ZAxok8b4Q2HvAmFHbVaQzyhx9GlvBtdhcBcl0rZ9WIcvd3uAzA3Q5h00hy2bpsvI');

var router = express.Router();

router.post("/", async(req, res) => {
  const { post_id, budget } = req.body

  if(post_id, budget){  
    const paymentIntent = await stripe.paymentIntents.create({
      amount: budget * 100,
      currency: 'usd',
      automatic_payment_methods: {
          enabled: true
      }
    }); 

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