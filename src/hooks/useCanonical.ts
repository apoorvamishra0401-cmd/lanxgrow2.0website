import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Client-side canonical for public SPA routes.
 * Production SEO should additionally serve canonical markup in initial HTML.
 */
const PUBLIC_CANONICAL_PATHS = new Set([
  '/', '/about', '/services', '/faq', '/smart-ai', '/get-started', '/privacy', '/terms',
]);

export function useCanonical() {
  const { pathname } = useLocation();

  useEffect(() => {
    const existing = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!PUBLIC_CANONICAL_PATHS.has(pathname)) {
      existing?.remove();
      return;
    }

    const link = existing ?? document.createElement('link');
    link.rel = 'canonical';
    link.href = new URL(pathname, 'https://www.lanxgrow.com').href;
    if (!existing) document.head.appendChild(link);
  }, [pathname]);
}
