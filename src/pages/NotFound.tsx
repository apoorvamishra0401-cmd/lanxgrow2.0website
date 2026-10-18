import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function NotFound() {
  usePageMeta('Page not found');

  return (
    <Container>
      <div className="max-w-2xl py-24 sm:py-32">
        <Eyebrow tone="muted">Page not found</Eyebrow>
        <h1 className="mt-6 font-display text-display-sm text-ink-900 sm:text-display-md">
          We could not find that page.
        </h1>
        <p className="lx-prose mt-6">
          The link may be old, or the page may have moved. You can return home or head to Services.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button to="/" withArrow>
            Back to home
          </Button>
          <Button to="/services" variant="secondary">
            Explore our services
          </Button>
        </div>
      </div>
    </Container>
  );
}
