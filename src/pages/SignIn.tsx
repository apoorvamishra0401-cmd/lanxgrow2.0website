import { signInPage } from '@/content/auth';
import { PageIntro } from '@/components/ui/PageIntro';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { usePageMeta } from '@/hooks/usePageMeta';

/**
 * Sign-in page.
 *
 * Account access is not part of this launch build, so this page is an
 * intentional, informational stop rather than a form that cannot work. It never
 * implies that sign-in is available.
 */
export default function SignIn() {
  usePageMeta('Your account', 'Account access at LanXgrow is not currently available.');

  return (
    <>
      <PageIntro
        eyebrow={signInPage.eyebrow}
        heading={signInPage.heading}
        supporting={signInPage.body}
        aside={
          <div className="mt-8">
            <Button to={signInPage.cta.to} withArrow>
              {signInPage.cta.label}
            </Button>
          </div>
        }
      />

      <Section tone="ivory">
        <div className="max-w-prose">
          <h2 className="font-display text-[1.5rem] text-ink-900">{signInPage.supportingHeading}</h2>
          <p className="lx-prose mt-4">{signInPage.supporting}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to={signInPage.cta.to} variant="secondary" withArrow>
              {signInPage.cta.label}
            </Button>
            <Button to={signInPage.faqCta.to} variant="ghost">
              {signInPage.faqCta.label}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
