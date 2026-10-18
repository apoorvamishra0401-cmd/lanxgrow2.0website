import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { cta, primaryNav } from '@/config/site';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/ui/Logo';

const linkBase =
  'relative py-1 text-[0.9375rem] transition-colors duration-300 ease-editorial';

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  /* Close the mobile drawer whenever the route changes. */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /* Swap to the solid header treatment once the page has scrolled. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Lock body scroll and support Escape while the drawer is open. */
  useEffect(() => {
    if (!open) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    // Move focus into the drawer for keyboard users.
    const firstLink = panelRef.current?.querySelector<HTMLElement>('a, button');
    firstLink?.focus();

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300 ease-editorial',
        scrolled || open
          ? 'border-b border-line bg-ivory/90 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <Container>
        <div className="flex h-[4.5rem] items-center justify-between gap-6 lg:h-20">
          <NavLink to="/" className="flex h-11 items-center rounded-md" aria-label="LanXgrow home">
            <Logo />
          </NavLink>

          {/* Desktop navigation */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {primaryNav.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      cn(
                        linkBase,
                        isActive
                          ? 'text-ink-900 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:bg-terracotta-500'
                          : 'text-ink-500 hover:text-ink-900',
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Button to="/signin" variant="ghost" size="sm">
              Sign in
            </Button>
            <Button to={cta.getStarted.to} size="sm" withArrow>
              {cta.getStarted.label}
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink-900 transition-colors duration-200 hover:border-terracotta-300 hover:text-terracotta-700 lg:hidden"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
              {open ? <path d="M5 5l10 10M15 5 5 15" /> : <path d="M3 6.5h14M3 13.5h14" />}
            </svg>
          </button>
        </div>
      </Container>

      {/* Mobile drawer.
          `max-height`/`opacity` hide it visually, but clipped content stays
          focusable and readable by assistive technology — so the closed drawer
          is also made `inert`. React 18 has no type for that attribute yet, so
          it is spread as the empty (boolean) form. */}
      <div
        id="mobile-navigation"
        {...(open ? {} : ({ inert: '' } as Record<string, unknown>))}
        className={cn(
          'border-t border-line bg-ivory transition-[max-height,opacity] duration-500 ease-editorial lg:hidden',
          open ? 'lx-drawer-open opacity-100' : 'max-h-0 overflow-hidden opacity-0',
        )}
      >
        <div ref={panelRef} className="px-6 pb-8 pt-4 sm:px-8">
          <nav aria-label="Primary mobile">
            <ul className="divide-y divide-line">
              {primaryNav.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center justify-between py-4 font-display text-[1.25rem] transition-colors',
                        isActive ? 'text-terracotta-700' : 'text-ink-800 hover:text-terracotta-700',
                      )
                    }
                  >
                    {item.label}
                    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5 text-ink-300" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 3.5l4.5 4.5L6 12.5" />
                    </svg>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-6 flex flex-col gap-3">
            <Button to={cta.getStarted.to} size="md" fullWidth withArrow>
              {cta.getStarted.label}
            </Button>
            <Button to="/signin" variant="secondary" size="md" fullWidth>
              Sign in
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
