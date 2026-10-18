/** Small, dependency-free validators shared by the contact and sign-in forms. */

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Permissive international phone check: digits, spaces, dashes, parens, leading +. */
export const PHONE_PATTERN = /^\+?[0-9][0-9\s\-()]{6,19}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function isValidPhone(value: string): boolean {
  return PHONE_PATTERN.test(value.trim());
}

export type EnquiryValues = {
  name: string;
  email: string;
  phone: string;
  reason: string;
  message: string;
  consent: boolean;
};

export type EnquiryErrors = Partial<Record<keyof EnquiryValues, string>>;

/** Field-level validation for the enquiry form. */
export function validateEnquiry(values: EnquiryValues): EnquiryErrors {
  const errors: EnquiryErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Please tell us your name.';
  }

  if (!values.email.trim()) {
    errors.email = 'Please enter an email address.';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'That email address does not look right.';
  }

  if (values.phone.trim() && !isValidPhone(values.phone)) {
    errors.phone = 'Please enter a valid phone number, or leave this blank.';
  }

  if (!values.reason) {
    errors.reason = 'Please choose what your enquiry is about.';
  }

  if (!values.message.trim()) {
    errors.message = 'Please add a short message.';
  } else if (values.message.trim().length < 12) {
    errors.message = 'A little more detail helps us respond properly.';
  }

  if (!values.consent) {
    errors.consent = 'Please confirm you are happy for us to respond to your enquiry.';
  }

  return errors;
}
