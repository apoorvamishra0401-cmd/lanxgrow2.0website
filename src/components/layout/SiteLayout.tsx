import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { RouteErrorBoundary } from './RouteErrorBoundary';
import { useScrollToTop } from '@/hooks/useScrollToTop';

/** Shared shell for every public page: skip link, header, content, footer. */
export function SiteLayout() {
  useScrollToTop();

  return (
    <div className="flex min-h-dvh flex-col bg-ivory">
      <a
        href="#main-content"
        className="sr-only rounded-md focus:not-sr-only focus:absolute focus:left-6 focus:top-4 focus:z-[100] focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-sm focus:text-ivory-50"
      >
        Skip to main content
      </a>

      <Header />

      <main id="main-content" className="flex-1 scroll-mt-[4.5rem] lg:scroll-mt-20">
        <RouteErrorBoundary>
          <Outlet />
        </RouteErrorBoundary>
      </main>

      <Footer />
    </div>
  );
}
