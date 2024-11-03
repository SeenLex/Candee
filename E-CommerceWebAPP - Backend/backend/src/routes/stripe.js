const router = require('express').Router();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
router.get('/config', (req, res) => {
    console.log(process.env.STRIPE_PUBLIC_KEY);
    res.status(200).json({ stripePublicKey: process.env.STRIPE_PUBLIC_KEY });
});

router.post('/create-payment', async (req, res) => {
    stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'usd',
        payment_method_types: ['card'],
    }).then((paymentIntent) => {
        res.status(200).send(paymentIntent.client_secret);
    }).catch((error) => {
        res.status(500).json(error);
    });
});

module.exports = router;