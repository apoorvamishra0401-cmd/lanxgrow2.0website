/**
 * Enquiry delivery.
 *
 * There is no paid email service and nothing is stored anywhere. If a
 * deployment provides an HTTPS endpoint that accepts a JSON POST — a free form
 * service, a serverless function, anything with a URL — the form posts to it and
 * reports success *only* when that endpoint answers with a success status. With
 * no endpoint configured, the form keeps its honest preview behaviour: it
 * validates, and it says plainly that nothing was sent.
 *
 * That keeps the rule the earlier stages were built on: never claim an enquiry
 * was delivered unless something real confirmed it.
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
        message: `The enquiry service replied with an error (${response.status}). Nothing was sent. Please try again, or use a published contact channel.`,
      };
    }

    return { ok: true, delivered: true };
  } catch {
    return {
      ok: false,
      reason: 'network',
      message:
        'We could not reach the enquiry service. Nothing was sent. Please check your connection and try again.',
    };
  }
}
