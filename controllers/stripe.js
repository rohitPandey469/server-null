const FRONTEND_URL = "https://stack-overflow-iota.vercel.app";
import "dotenv/config"
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripePayment = async (req, res) => {
  const { product } = req.body;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: product.name,
          },
          unit_amount: product.price * 100,
        },
        quantity: product.quantity,
      },
    ],
    mode: "payment",
    success_url: `${FRONTEND_URL}/checkout/success`,
    cancel_url: `${FRONTEND_URL}/checkout/cancel`,
  });
  res.json({ id: session.id });
};
