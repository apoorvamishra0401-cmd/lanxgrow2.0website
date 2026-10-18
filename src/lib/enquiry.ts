/**
 * Enquiry delivery.
 *
 * There is no paid email service and nothing is stored anywhere. If a
 * deployment provides an HTTPS endpoint that accepts a JSON POST — a free form
 * service, a serverless function, anything with a URL — the form posts to it and
 * reports success *only* when that endpoint answers with a success status. With
 * no endpoint configured, the Contact page keeps every control disabled and
 * nothing is submitted at all.
 *
 * That keeps the rule the earlier stages were built on: never claim an enquiry
 * was delivered unless something real confirmed it. The same rule applies in the
 * other direction. A request that fails or is interrupted is reported as
 * *delivery unconfirmed* — never as "nothing was sent" — because a POST that
 * reached the endpoint before the connection dropped may already have been
 * processed, and claiming otherwise could push a visitor into sending a
 * duplicate enquiry.
 */

import type { EnquiryValues } from './validation';

export type EnquiryResult =
  | { ok: true; delivered: true }
  | { ok: false; reason: 'not-configured' }
  | { ok: false; reason: 'network' | 'rejected'; message: string };

/**
 * Reads the configured endpoint.
 *
 * HTTPS is required for anything remote, because an enquiry carries personal
 * details. Plain HTTP is allowed only for a loopback address, which is how the
 * form is exercised against a local stub during development.
 */
export function getContactEndpoint(): string | null {
  const endpoint = String(import.meta.env.VITE_CONTACT_ENDPOINT ?? '').trim();
  if (!endpoint) return null;

  const isLoopback = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(endpoint);
  const isSecure = /^https:\/\//i.test(endpoint);

  return isSecure || isLoopback ? endpoint : null;
}

export function isEnquiryDeliveryConfigured(): boolean {
  return getContactEndpoint() !== null;
}

export async function sendEnquiry(values: EnquiryValues): Promise<EnquiryResult> {
  const endpoint = getContactEndpoint();
  if (!endpoint) return { ok: false, reason: 'not-configured' };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...values, submittedAt: new Date().toISOString() }),
    });

    if (!response.ok) {
      return {
        ok: false,
        reason: 'rejected',
        message: `The enquiry service replied with an error (${response.status}), so we could not confirm that your enquiry was delivered. It may still have reached the LanXgrow team, so please avoid sending the same enquiry twice.`,
      };
    }

    return { ok: true, delivered: true };
  } catch {
    return {
      ok: false,
      reason: 'network',
      message:
        'The connection to the enquiry service failed, so we could not confirm that your enquiry was delivered. It may still have reached the LanXgrow team, so please check your connection before trying again and avoid sending the same enquiry twice.',
    };
  }
}
