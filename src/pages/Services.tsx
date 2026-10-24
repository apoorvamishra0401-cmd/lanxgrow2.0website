import { services, servicesIntro, servicesNotes } from '@/content/services';
import type { ComponentType } from 'react';
import { PageIntro } from '@/components/ui/PageIntro';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { ConversationThreads } from '@/components/visuals/ConversationThreads';
import { usePageMeta } from '@/hooks/usePageMeta';

/**
 * One original motif per service, each illustrating what that service's summary
 * describes in prose: communication as a two-way exchange, and mentorship as
 * guidance that travels *with* the learner.
 */
const serviceVisuals: Record<string, ComponentType<{ className?: string }>> = {
  'english-communication': ConversationThreads,
};

export default function Services() {
  usePageMeta('Services', 'English Communication and guided learning support at LanXgrow.');

  return (
    <>
      <PageIntro
        eyebrow={servicesIntro.eyebrow}
        heading={servicesIntro.heading}
        supporting={servicesIntro.supporting}
      />

      {/* Primary services — one editorial block each, no card repetition. */}
      {services.map((service, index) => {
        const ServiceVisual = serviceVisuals[service.id];

        return (
        <Section key={service.id} id={service.id} tone={index % 2 === 0 ? 'ivory' : 'alabaster'} divided>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-7">
              <Eyebrow>{service.eyebrow}</Eyebrow>
              <h2 className="mt-6 max-w-xl font-display text-display-sm text-ink-900">
                {service.title}
              </h2>
              <p className="lx-prose mt-7">{service.summary}</p>

              <div className="mt-9">
                <Button to="/get-started" withArrow>
                  Get started
                </Button>
              </div>
            </Reveal>

            <Reveal delay={90} className="lg:col-span-5">
              <div className="rounded-[20px] border border-line bg-ivory-50 p-7 sm:p-8">
                {ServiceVisual ? (
                  <div className="mb-7 border-b border-line pb-7">
                    <ServiceVisual className="max-w-sm" />
                  </div>
                ) : null}

                <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink-500">
                  {service.includesHeading}
                </h3>
                <ul className="mt-5 space-y-4 border-t border-line pt-6">
                  {service.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[0.9375rem] leading-[1.7] text-ink-700">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Section>
        );
      })}

      {/* Honest pre-enrolment notes. */}
      <Section tone="alabaster" divided>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <Eyebrow tone="muted">Notes</Eyebrow>
            <h2 className="mt-6 font-display text-[1.75rem] text-ink-900">{servicesNotes.heading}</h2>
          </Reveal>
          <Reveal delay={80} className="lg:col-span-8">
            <ul className="border-t border-line">
              {servicesNotes.items.map((note) => (
                <li key={note} className="border-b border-line py-5 text-[1.0625rem] leading-[1.7] text-ink-500">
                  {note}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
