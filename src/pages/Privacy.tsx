import { getPrivacySections, privacyIntro } from '@/content/privacy';
import { isEnquiryDeliveryConfigured } from '@/lib/enquiry';
import { PageIntro } from '@/components/ui/PageIntro';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function Privacy() {
  usePageMeta('Privacy Notice', 'What the LanXgrow website does with your information.');

  // The notice must describe the build that is actually deployed: with no
  // enquiry endpoint configured the form is disabled and nothing is sent.
  const sections = getPrivacySections({
    enquiryDeliveryEnabled: isEnquiryDeliveryConfigured(),
  });

  return (
    <>
      <PageIntro
        eyebrow={privacyIntro.eyebrow}
        heading={privacyIntro.heading}
        supporting={privacyIntro.supporting}
      />

      <Section tone="ivory">
        <div className="max-w-prose">
          {sections.map((section, index) => (
            <Reveal
              key={section.heading}
              delay={index === 0 ? 0 : 40}
              className={index === 0 ? undefined : 'mt-12'}
            >
              <h2 className="font-display text-[1.375rem] text-ink-900 sm:text-[1.5rem]">
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="lx-prose mt-4">
                  {paragraph}
                </p>
              ))}
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
