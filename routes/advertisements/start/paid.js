// Stripe webhook receiver

const express = require("express");
const { STRIPE } = require("../../../config/api.config");
const db = require("../../../middleware/database/database.connection");
const stripe = require("stripe")(STRIPE);
const axios = require("axios");

var router = express.Router();

router.post("", express.raw({ type: "application/json" }), (req, res) => {
  let event;
  const endpointSecret = "we_1NEYAtBVdpaK1AsGNdMIcvck"; // Given when doing npm run webhhooks
  const sig = req.headers["stripe-signature"];

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(err);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  const obj = event.data.object;

  console.log(obj);

  switch (event.type) {
    case "payment_intent.succeeded":
      db.query(
        "UPDATE tbladvertisements SET status = 'active' WHERE stripe_id = ?",
        [obj.id],
        (err, result) => {
          if (err) {
            console.log(err);
          }
        }
      );

      break;
    default:
      console.log(`Unhandled event type ${event.type}: ${obj}`);
  }

  res.json({ received: true });
});

module.exports = router;
