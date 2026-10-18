import type { ReactNode } from 'react';
import { Container } from './Container';
import { Eyebrow } from './Eyebrow';
import { Reveal } from './Reveal';

/**
 * Editorial page opener shared by About, Services, FAQ, Contact and Sign in.
 * Keeps the top-of-page rhythm identical across the site.
 */
export function PageIntro({
  eyebrow,
  heading,
  supporting,
  aside,
}: {
  eyebrow: string;
  heading: string;
  supporting?: string;
  aside?: ReactNode;
}) {
  return (
    <header className="border-b border-line bg-ivory-50 pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="mt-6 max-w-2xl font-display text-display-sm text-ink-900 sm:text-display-md">
              {heading}
            </h1>
          </Reveal>

          {(supporting || aside) && (
            <Reveal delay={80} className="lg:col-span-5 lg:pt-3">
              {supporting && (
                <p className="max-w-prose text-[1.0625rem] leading-[1.75] text-ink-500">{supporting}</p>
              )}
              {aside}
            </Reveal>
          )}
        </div>
      </Container>
    </header>
  );
}
