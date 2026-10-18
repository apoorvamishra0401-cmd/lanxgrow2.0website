import { accountPage } from '@/content/auth';
import { PageIntro } from '@/components/ui/PageIntro';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { usePageMeta } from '@/hooks/usePageMeta';

/**
 * Account page.
 *
 * Accounts are not available in this launch build, so this route is a calm,
 * intentional pointer to the programme rather than a signed-in area. It never
 * shows a signed-in state it has not been given.
 */
export default function Account() {
  usePageMeta('Your account', 'Explore LanXgrow’s approach to English Communication and guided learning.');

  return (
    <>
      <PageIntro
        eyebrow={accountPage.eyebrow}
        heading={accountPage.heading}
        supporting={accountPage.body}
        aside={
          <div className="mt-8">
            <Button to={accountPage.cta.to} withArrow>
              {accountPage.cta.label}
            </Button>
          </div>
        }
      />

      <Section tone="ivory">
        <div className="max-w-prose">
          <h2 className="font-display text-[1.5rem] text-ink-900">{accountPage.supportingHeading}</h2>
          <p className="lx-prose mt-4">{accountPage.supporting}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to={accountPage.cta.to} variant="secondary" withArrow>
              {accountPage.cta.label}
            </Button>
            <Button to={accountPage.faqCta.to} variant="ghost">
              {accountPage.faqCta.label}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
