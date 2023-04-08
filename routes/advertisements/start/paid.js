// The webhook receiver
// Save in DB

// const app = require('express')();
// const stripe = require('stripe')('sk_test_51MbMPvBVdpaK1AsGqefv3y85wiNmEH4cq8ZAxok8b4Q2HvAmFHbVaQzyhx9GlvBtdhcBcl0rZ9WIcvd3uAzA3Q5h00hy2bpsvI');
// const bodyParser = require('body-parser');

// app.post('/webhook', bodyParser.raw({type: 'application/json'}), (request, response) => {
//   const payload = request.body;

//   console.log("Got payload: " + payload);

//   response.status(200).end();
// });

const express = require("express");
const { STRIPE } = require('../../../config/api.config');
const db = require("../../../middleware/database/database.connection");
const stripe = require('stripe')(STRIPE)
const axios = require('axios');

var router = express.Router();

router.post('', express.raw({type: 'application/json'}), (req, res) => {
    let event;
    const endpointSecret = 'whsec_f0e36a64d3d85a2b865a68af3a02116159da99c919609d8ae429a7c02eeb5856'; // Given when doing npm run webhhooks
    const sig = req.headers['stripe-signature'];
  
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
    } catch (err) {
      console.log(err)
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    const obj = event.data.object

    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log(obj);
        db.query("UPDATE tbladvertisements SET status = 'active' WHERE stripe_id = ?", [obj.id], (err, result) => {
          if(err){
            console.log(err)
          } 
        })

        break
      default:
        console.log(`Unhandled event type ${event.type}: ${obj}`);
    }
  
    res.json({received: true});
});

module.exports = router;
