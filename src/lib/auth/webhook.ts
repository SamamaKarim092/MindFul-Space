// Webhook secret validation for n8n callbacks

import { timingSafeEqual } from 'crypto';

export function validateWebhookSecret(request: Request): boolean {
  const secret = request.headers.get('x-webhook-secret');
  const expectedSecret = process.env.WEBHOOK_SECRET;

  if (!expectedSecret) {
    const env = process.env.NODE_ENV;
    if (env === 'development' || env === 'test') {
      console.warn('WEBHOOK_SECRET not configured — allowing in', env, 'mode');
      return true;
    }
    console.error(
      'WEBHOOK_SECRET is not set and NODE_ENV is not development/test. Denying webhook request.',
    );
    return false;
  }

  if (!secret) return false;

  const a = Buffer.from(String(secret));
  const b = Buffer.from(String(expectedSecret));

  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}
