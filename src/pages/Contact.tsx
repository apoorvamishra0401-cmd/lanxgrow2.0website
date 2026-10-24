import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  contactAside,
  contactDirect,
  contactIntro,
  contactLiveCopy,
  enquiryReasons,
} from '@/content/contact';
import {
  type EnquiryErrors,
  type EnquiryValues,
  validateEnquiry,
} from '@/lib/validation';
import { isEnquiryDeliveryConfigured, sendEnquiry } from '@/lib/enquiry';
import { PageIntro } from '@/components/ui/PageIntro';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select, Textarea, useFieldId } from '@/components/ui/Field';
import { usePageMeta } from '@/hooks/usePageMeta';
import { hasPublishedContactChannels, contactChannels } from '@/config/site';

const emptyValues: EnquiryValues = {
  name: '',
  email: '',
  phone: '',
  reason: '',
  message: '',
  consent: false,
};

/**
 * Contact page.
 *
 * Whether the form can *send* depends on configuration. With an enquiry
 * endpoint set, it posts to it and reports success only when that endpoint
 * confirms delivery. With none set — as in this launch build — the form is
 * shown but its controls are disabled behind a clear availability message, so
 * nothing can be mistaken for a delivered enquiry.
 */
export default function Contact() {
  usePageMeta('Contact', 'Contact the LanXgrow team about English Communication and mentorship.');

  const deliveryConfigured = isEnquiryDeliveryConfigured();

  const [values, setValues] = useState<EnquiryValues>(emptyValues);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState<'idle' | 'checking' | 'done' | 'error' | 'failed'>('idle');
  const [failureMessage, setFailureMessage] = useState<string | null>(null);

  const ids = {
    name: useFieldId('contact-name'),
    email: useFieldId('contact-email'),
    phone: useFieldId('contact-phone'),
    reason: useFieldId('contact-reason'),
    message: useFieldId('contact-message'),
    consent: useFieldId('contact-consent'),
  };
  const consentErrorId = useFieldId('contact-consent-error');

  const update = <K extends keyof EnquiryValues>(key: K, value: EnquiryValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    // Clear a field's error as soon as the visitor corrects it.
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
    // The previous summary no longer describes the form once it is edited.
    setStatus((current) =>
      current === 'error' || current === 'done' || current === 'failed' ? 'idle' : current,
    );
    setFailureMessage(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // The form is inactive until an endpoint is configured, so there is nothing
    // to submit and nothing to claim.
    if (!deliveryConfigured) return;

    const nextErrors = validateEnquiry(values);
    setErrors(nextErrors);
    setFailureMessage(null);

    if (Object.keys(nextErrors).length > 0) {
      setStatus('error');
      const firstField = Object.keys(nextErrors)[0];
      document.getElementById(ids[firstField as keyof typeof ids])?.focus();
      return;
    }

    setStatus('checking');
    const result = await sendEnquiry(values);

    if (!result.ok) {
      setFailureMessage(
        'message' in result && result.message
          ? result.message
          : 'We could not confirm that your enquiry was delivered. Please try again.',
      );
      setStatus('failed');
      return;
    }

    setStatus('done');
    setValues(emptyValues);
  };

  return (
    <>
      <PageIntro
        eyebrow={contactIntro.eyebrow}
        heading={contactIntro.heading}
        supporting={deliveryConfigured ? contactLiveCopy.introSupporting : contactIntro.supporting}
      />

      <Section tone="ivory">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Form */}
          <div className="lg:col-span-7">
            {hasPublishedContactChannels && (
              <Reveal delay={30}>
                <Eyebrow tone="muted">{contactDirect.heading}</Eyebrow>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-500">
                  {contactDirect.body}
                </p>
                <ul className="mt-5 space-y-3">
                  {contactChannels.email && (
                    <li>
                      <a
                        href={`mailto:${contactChannels.email}`}
                        className="inline-flex items-center gap-2 py-1.5 text-terracotta-600 transition-colors hover:text-terracotta-700"
                      >
                        {contactChannels.email}
                        <span aria-hidden="true"> →</span>
                      </a>
                    </li>
                  )}
                  {contactChannels.phone && (
                    <li>
                      <a
                        href={`tel:${contactChannels.phone.replace(/\s+/g, '')}`}
                        className="inline-flex items-center gap-2 py-1.5 text-terracotta-600 transition-colors hover:text-terracotta-700"
                      >
                        {contactChannels.phone}
                        <span aria-hidden="true"> →</span>
                      </a>
                    </li>
                  )}
                </ul>
              </Reveal>
            )}

            <Reveal delay={60} className="mt-8">
              <form noValidate onSubmit={handleSubmit}>
                <fieldset
                  disabled={!deliveryConfigured}
                  className="min-w-0 space-y-6 disabled:opacity-80"
                >
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field
                      label="Your name"
                      htmlFor={ids.name}
                      required
                      error={errors.name}
                    >
                      <Input
                        id={ids.name}
                        name="name"
                        autoComplete="name"
                        value={values.name}
                        invalid={Boolean(errors.name)}
                        onChange={(e) => update('name', e.target.value)}
                        placeholder="Full name"
                      />
                    </Field>

                    <Field
                      label="Email address"
                      htmlFor={ids.email}
                      required
                      error={errors.email}
                    >
                      <Input
                        id={ids.email}
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        value={values.email}
                        invalid={Boolean(errors.email)}
                        onChange={(e) => update('email', e.target.value)}
                        placeholder="you@example.com"
                      />
                    </Field>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field
                      label="Phone number"
                      htmlFor={ids.phone}
                      hint="Useful if you would prefer a call instead."
                      error={errors.phone}
                    >
                      <Input
                        id={ids.phone}
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={values.phone}
                        invalid={Boolean(errors.phone)}
                        onChange={(e) => update('phone', e.target.value)}
                        placeholder="+91 98765 43210"
                      />
                    </Field>

                    <Field
                      label="What is this about?"
                      htmlFor={ids.reason}
                      required
                      error={errors.reason}
                    >
                      <Select
                        id={ids.reason}
                        name="reason"
                        value={values.reason}
                        invalid={Boolean(errors.reason)}
                        onChange={(e) => update('reason', e.target.value)}
                      >
                        <option value="">Please choose…</option>
                        {enquiryReasons.map((reason) => (
                          <option key={reason} value={reason}>
                            {reason}
                          </option>
                        ))}
                      </Select>
                    </Field>
                  </div>

                  <Field
                    label="Your message"
                    htmlFor={ids.message}
                    required
                    error={errors.message}
                    hint="Tell us about the learner and what you are hoping for."
                  >
                    <Textarea
                      id={ids.message}
                      name="message"
                      rows={5}
                      value={values.message}
                      invalid={Boolean(errors.message)}
                      onChange={(e) => update('message', e.target.value)}
                      placeholder="A few sentences is plenty."
                    />
                  </Field>

                  {/* Consent */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-3">
                      <input
                        id={ids.consent}
                        name="consent"
                        type="checkbox"
                        required
                        checked={values.consent}
                        aria-invalid={errors.consent ? true : undefined}
                        aria-describedby={errors.consent ? consentErrorId : undefined}
                        onChange={(e) => update('consent', e.target.checked)}
                        className="mt-0.5 h-5 w-5 shrink-0 rounded border-line text-terracotta-600 accent-terracotta-600 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                      <label htmlFor={ids.consent} className="text-[0.9375rem] leading-[1.6] text-ink-700">
                        I am happy for the LanXgrow team to respond to this enquiry.
                        <span className="text-terracotta-600" aria-hidden="true"> *</span>
                      </label>
                    </div>
                    {errors.consent && (
                      <p id={consentErrorId} className="text-[0.8125rem] text-terracotta-700">
                        {errors.consent}
                      </p>
                    )}
                  </div>
                </fieldset>

                {/* Status */}
                {status === 'error' && (
                  <Alert tone="error" title="Please check the highlighted fields" className="mt-6">
                    A few details still need attention before this form is ready.
                  </Alert>
                )}

                {status === 'failed' && (
                  <Alert tone="error" title={contactLiveCopy.failedTitle} className="mt-6">
                    {failureMessage}
                  </Alert>
                )}

                {status === 'done' && (
                  <Alert tone="success" title={contactLiveCopy.successTitle} className="mt-6">
                    {contactLiveCopy.success}
                  </Alert>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-4 pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    withArrow
                    disabled={!deliveryConfigured}
                    loading={status === 'checking'}
                  >
                    {status === 'checking' ? contactLiveCopy.checking : contactLiveCopy.send}
                  </Button>
                  <p className="text-[0.8125rem] text-ink-500">
                    Fields marked <span className="text-terracotta-600">*</span> are required.
                  </p>
                </div>
              </form>
            </Reveal>
          </div>

          {/* Aside */}
          <Reveal delay={90} className="lg:col-span-5">
            <div className="rounded-[20px] border border-line bg-sand/60 p-8 sm:p-10">
              <Eyebrow tone="muted">Process</Eyebrow>
              <h2 className="mt-6 font-display text-[1.5rem] text-ink-900">{contactAside.heading}</h2>
              <ol className="mt-7 space-y-5">
                {contactAside.points.map((point, index) => (
                  <li key={point} className="flex items-start gap-4">
                    <span aria-hidden="true" className="font-display text-[1.0625rem] leading-none text-terracotta-500">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[0.9375rem] leading-[1.7] text-ink-700">{point}</span>
                  </li>
                ))}
              </ol>

              <div className="mt-8 flex items-center gap-3 rounded-lg border border-line bg-ivory-50 p-4 sm:p-6 hover:bg-ivory-100 transition-colors" onClick={() => window.open('https://wa.me/9826365691', '_blank')} role="button" aria-label="Contact via WhatsApp" tabIndex={0}>
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-terracotta-500" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06H5.66a5 5 0 0 0-1 9.44c0 .13-.03.26-.05.39l2.04 2.11a5.5 5.5 0 0 0 7.78 7.78l4.77-4.77a5.5 5.5 0 0 0 0-7.77z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span className="text-[0.9375rem] leading-[1.6] text-ink-900">WhatsApp</span>
              </div>

              <div className="mt-8 flex items-center gap-3 rounded-lg border border-line bg-ivory-50 p-4 sm:p-6 hover:bg-ivory-100 transition-colors" onClick={() => window.open('mailto:official@lanxgrow.com', '_blank')} role="button" aria-label="Email LanXgrow team" tabIndex={0}>
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-terracotta-500" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <path d="M22 6l-10 7L2 6" />
                </svg>
                <span className="text-[0.9375rem] leading-[1.6] text-ink-900">Contact Details</span>
              </div>

              <p className="text-[0.8125rem] text-ink-500">
                Email: <span className="text-terracotta-600 underline underline-offset-2">official@lanxgrow.com</span>
              </p>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
