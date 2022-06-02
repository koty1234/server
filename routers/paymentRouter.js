const router = require("express").Router();
const stripe = require("stripe")('sk_test_51KmNReLdXBVrhWF2wecs4kM8JISNzC1qyNDEvt4KK5zZO2MBt8Vf8g56uTiktwgp3V5V2dOHdFa6DB0KcmYUY3Eh00Zi5nQuB4');
const auth = require("../middleware/auth");

router.post("/create-payment-intent", async (req,res) => {
    console.log("here");
    const { price } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
        amount: price,
        currency: "cad",
        automatic_payment_methods: {
            enabled: true,
        },
    });
    res.send({
        clientSecret: paymentIntent.client_secret,
    });
});

module.exports = router;