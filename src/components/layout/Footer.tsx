import { EmailLink } from '@/components/support/SupportLinks';
import { Link } from 'react-router-dom';
import { brand, cta, footerNav, hasPublishedContactChannels, contactChannels } from '@/config/site';
import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/ui/Logo';

const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="lx-footer border-t border-line bg-ink-900 text-ivory-100">
      <Container>
        <div className="grid gap-14 py-18 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-16 lg:py-22">
          {/* Brand column */}
          <div className="max-w-sm">
            <Logo tone="inverse" />
            <p className="mt-6 text-[0.9375rem] leading-relaxed text-ivory-100/70">
              {brand.description}
            </p>
            <p className="mt-8 text-[0.8125rem] uppercase tracking-[0.16em] text-terracotta-300">
              {brand.tagline}
            </p>
          </div>

          {/* Navigation column */}
          <nav aria-label="Footer">
            <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ivory-100/50">
              Explore
            </h2>
            <ul className="mt-5 space-y-3.5">
              {footerNav.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="inline-block py-1.5 text-[0.9375rem] text-ivory-100/80 transition-colors duration-200 hover:text-terracotta-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact / CTA column */}
          <div>
            <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ivory-100/50">
              Connect with us
            </h2>
            <div className="mt-5 space-y-3 text-[0.9375rem] text-ivory-100/80">
              {hasPublishedContactChannels ? (
                <ul className="space-y-3">
                  {contactChannels.email && (
                    <li>
                      <EmailLink />
                    </li>
                  )}
                  {contactChannels.phone && (
                    <li>
                      <a href={`tel:${contactChannels.phone.replace(/\s+/g, '')}`} className="transition-colors hover:text-terracotta-300">
                        {contactChannels.phone}
                      </a>
                    </li>
                  )}
                  {contactChannels.address && <li className="text-ivory-100/60">{contactChannels.address}</li>}
                </ul>
              ) : (
                <p className="text-ivory-100/60">
                  Our enquiry channels are not open yet.
                </p>
              )}

              <p className="pt-1">
                <Link to={cta.talkToUs.to} className="inline-flex items-center gap-2 py-1.5 text-terracotta-300 transition-colors hover:text-terracotta-200">
                  {cta.talkToUs.label}
                  <span aria-hidden="true">→</span>
                </Link>
              </p>
            </div>
          </div>
        </div>

        <figure className="brand-footer-art" aria-label="LanXgrow brand signature">
          <img src="/images/brand/lanxgrow-footer-transparent.webp" alt="LanXgrow — sculpted three-dimensional brand emblem and wordmark" width="2048" height="682" loading="lazy" decoding="async" />
        </figure>
        <div className="flex flex-col gap-4 border-t border-ivory-100/12 py-8 text-[0.8125rem] text-ivory-100/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {brand.name}. All rights reserved.
          </p>
          <p>{brand.tagline}</p>
        </div>
      </Container>
    </footer>
  );
}
