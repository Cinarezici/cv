# Vercel Deployment & Environment Variables

To ensure the Polar integration works correctly on Vercel, you must add the following environment variables in your Vercel Project Settings.

## Required Environment Variables

| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_POLAR_CHECKOUT_URL` | The direct redirect URL for the Polar checkout link. (e.g., `https://sandbox-api.polar.sh/v1/checkout-links/polar_cl_.../redirect`) |
| `POLAR_ACCESS_TOKEN` | Your Polar Personal Access Token. |
| `POLAR_SUCCESS_URL` | The callback URL after a successful purchase. Use: `https://your-domain.com/billing/success?checkout_id={CHECKOUT_ID}` |
| `POLAR_WEBHOOK_SECRET` | The webhook signing secret from your Polar dashboard (for verifying one-time payment completions). |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (must be set in Vercel to allow webhook server-side client connection). |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase Service Role Key (needed to securely assign Pro status via the webhook). |
| `RESEND_API_KEY` | Your Resend API key for sending emails. |
| `OPENAI_API_KEY` | Your OpenAI API key for AI features. |
| `APIFY_API_TOKEN` | Your Apify API token for LinkedIn scraping. |

## Important Notes

1. **One-time Payment**: The application has been updated to reflect a $99 one-time payment model. Ensure your Polar product is configured accordingly as a "One-time" product, not a "Subscription".
2. **Local Environment**: Update your `.env.local` to match the values in Vercel for consistent testing.
3. **Public Variables**: Variables prefixed with `NEXT_PUBLIC_` are available on the client-side. The checkout redirect relies on `NEXT_PUBLIC_POLAR_CHECKOUT_URL` being publicly accessible.
