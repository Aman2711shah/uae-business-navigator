import Stripe from "stripe";

/**
 * Environment Variables Required:
 * - STRIPE_SECRET_KEY: Your Stripe secret key (sk_test_... or sk_live_...)
 * - CLIENT_URL: Your frontend URL (e.g., https://yourdomain.com)
 * 
 * To set these in production:
 * - Vercel: Add to Environment Variables in dashboard
 * - Netlify: Add to Site settings > Environment variables
 * - AWS Lambda: Set in function configuration
 */

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Stripe Checkout Session Creation Handler
 * 
 * Test with curl:
 * 
 * curl -X POST http://localhost:3000/api/create-checkout-session \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "items": [
 *       {"priceId": "price_1234567890", "qty": 1},
 *       {"priceId": "price_0987654321", "qty": 2}
 *     ],
 *     "customerEmail": "customer@example.com"
 *   }'
 * 
 * Success Response:
 * {"sessionId": "cs_test_1234567890abcdef"}
 * 
 * Error Response:
 * {"error": "Invalid items"}
 */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Parse request body
    const { items, customerEmail } = req.body;

    // Validate items array
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: "Invalid items" });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerEmail,
      line_items: items.map(item => ({
        price: item.priceId,
        quantity: item.qty
      })),
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`
    });

    // Return session ID for frontend redirect
    return res.status(200).json({ sessionId: session.id });

  } catch (error) {
    // Log full error details for debugging
    console.error('Stripe checkout session creation failed:', {
      error: error.message,
      stack: error.stack,
      type: error.type,
      code: error.code
    });

    // Return generic error message to client
    return res.status(500).json({ error: "Payment init failed" });
  }
}

/**
 * Additional curl test examples:
 * 
 * 1. Test with invalid items (should return 400):
 * curl -X POST http://localhost:3000/api/create-checkout-session \
 *   -H "Content-Type: application/json" \
 *   -d '{"items": "invalid", "customerEmail": "test@example.com"}'
 * 
 * 2. Test with GET method (should return 405):
 * curl -X GET http://localhost:3000/api/create-checkout-session
 * 
 * 3. Test with missing environment variables (should return 500):
 * # Remove STRIPE_SECRET_KEY from environment and test
 */