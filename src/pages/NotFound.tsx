import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { cta, primaryNav } from '@/config/site';
import { usePageMeta } from '@/hooks/usePageMeta';
import { Link } from 'react-router-dom';

export default function NotFound() {
  usePageMeta('Page not found');

  return (
    <Container>
      <div className="max-w-2xl py-24 sm:py-32">
        <Eyebrow tone="muted">Page not found</Eyebrow>
        <h1 className="mt-6 font-display text-display-sm text-ink-900 sm:text-display-md">
          This page does not exist.
        </h1>
        <p className="lx-prose mt-6">
          The link may be out of date. Everything on the site is one of the pages below.
        </p>

        <ul className="mt-8 flex flex-wrap gap-3">
          {primaryNav.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="inline-flex items-center rounded-full border border-line bg-ivory-50 px-4 py-2 text-[0.875rem] text-ink-700 transition-colors duration-200 hover:border-terracotta-300 hover:text-terracotta-700"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <Button to={cta.getStarted.to} withArrow>
            {cta.getStarted.label}
          </Button>
        </div>
      </div>
    </Container>
  );
}
