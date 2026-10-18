import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  contactAside,
  contactFormNotice,
  contactIntro,
  enquiryReasons,
} from '@/content/contact';
import {
  type EnquiryErrors,
  type EnquiryValues,
  validateEnquiry,
} from '@/lib/validation';
import { PageIntro } from '@/components/ui/PageIntro';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select, Textarea, useFieldId } from '@/components/ui/Field';
import { usePageMeta } from '@/hooks/usePageMeta';

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
 * Stage 1 scope: the form is fully styled and validated in the browser, but it
 * does not send or store anything. The success state says so explicitly rather
 * than implying delivery.
 */
export default function Contact() {
  usePageMeta('Contact', 'Send an enquiry to the LanXgrow team.');

  const [values, setValues] = useState<EnquiryValues>(emptyValues);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState<'idle' | 'checking' | 'done' | 'error'>('idle');

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
    setStatus((current) => (current === 'error' || current === 'done' ? 'idle' : current));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateEnquiry(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus('error');
      const firstField = Object.keys(nextErrors)[0];
      document.getElementById(ids[firstField as keyof typeof ids])?.focus();
      return;
    }

    // Simulated round-trip so the loading state is demonstrable.
    setStatus('checking');
    window.setTimeout(() => {
      setStatus('done');
      setValues(emptyValues);
    }, 700);
  };

  return (
    <>
      <PageIntro
        eyebrow={contactIntro.eyebrow}
        heading={contactIntro.heading}
        supporting={contactIntro.supporting}
      />

      <Section tone="ivory">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Form */}
          <div className="lg:col-span-7">
            <Reveal>
              <Alert tone="info" title="Frontend preview">
                {contactFormNotice}
              </Alert>
            </Reveal>

            <Reveal delay={60} className="mt-8">
              <form noValidate onSubmit={handleSubmit} className="space-y-6">
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
                      className="mt-0.5 h-5 w-5 shrink-0 rounded border-line text-terracotta-600 accent-terracotta-600"
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

                {/* Status */}
                {status === 'error' && (
                  <Alert tone="error" title="Please check the highlighted fields">
                    A few details still need attention before this form is ready.
                  </Alert>
                )}

                {status === 'done' && (
                  <Alert tone="success" title="Form validated">
                    Nothing was stored or sent — this is a preview of the form. Enquiry
                    delivery will be connected in a later stage, and the form will
                    then reach the LanXgrow team.
                  </Alert>
                )}

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Button type="submit" size="lg" withArrow loading={status === 'checking'}>
                    {status === 'checking' ? 'Checking…' : 'Send enquiry'}
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

              <p className="mt-8 border-t border-line pt-6 text-[0.8125rem] leading-relaxed text-ink-500">
                {contactAside.note}
              </p>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
