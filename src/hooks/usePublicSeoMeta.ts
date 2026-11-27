import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import pages from '../../seo/public-pages.json';

const origin = 'https://www.lanxgrow.com';

/**
 * Ensures SPA navigation agrees with build-time, crawler-visible HTML metadata.
 * Private/interactive routes must never inherit a marketing page canonical.
 */
export function usePublicSeoMeta() {
  const { pathname } = useLocation();
  useEffect(() => {
    const page = pages.find(item => item.path === pathname);
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!page) {
      canonical?.remove();
      return;
    }

    document.title = page.title;
    const link = canonical ?? document.createElement('link');
    link.rel = 'canonical';
    link.href = origin + page.path;
    if (!canonical) document.head.appendChild(link);

    const setMeta = (attribute: 'name' | 'property', name: string, value: string) => {
      let tag = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, name);
        document.head.appendChild(tag);
      }
      tag.content = value;
    };
    setMeta('name', 'description', page.description);
    setMeta('property', 'og:title', page.title);
    setMeta('property', 'og:description', page.description);
    setMeta('property', 'og:url', origin + page.path);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:image', origin + '/icons/icon-512.png');
    setMeta('name', 'twitter:card', 'summary');
    setMeta('name', 'twitter:title', page.title);
    setMeta('name', 'twitter:description', page.description);
    setMeta('name', 'twitter:image', origin + '/icons/icon-512.png');
  }, [pathname]);
}
