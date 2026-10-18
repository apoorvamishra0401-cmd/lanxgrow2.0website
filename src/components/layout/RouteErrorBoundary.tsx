import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';

/**
 * Catches render errors inside a route.
 *
 * The boundary wraps only the routed content, so a crash in one page leaves the
 * header, navigation and footer usable — the visitor can move on instead of
 * facing a blank screen. No reporting service is connected.
 */
class RouteBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Kept in the console for debugging; nothing is sent anywhere.
    console.error('LanXgrow route error:', error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <Container>
        <div className="max-w-2xl py-24 sm:py-32">
          <Eyebrow tone="muted">Something went wrong</Eyebrow>
          <h1 className="mt-6 font-display text-display-sm text-ink-900 sm:text-display-md">
            This page could not be displayed.
          </h1>
          <p className="lx-prose mt-6">
            The rest of the site is still working. Continue from the home page, or get in
            touch if this keeps happening.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/" withArrow>
              Back to home
            </Button>
            <Button to="/contact" variant="secondary">
              Contact us
            </Button>
          </div>
        </div>
      </Container>
    );
  }
}

/** Remounts the boundary on navigation, so a failed page can be left behind. */
export function RouteErrorBoundary({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return <RouteBoundary key={pathname}>{children}</RouteBoundary>;
}
