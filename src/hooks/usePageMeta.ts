import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import publicPages from '../../seo/public-pages.json';

/** Keeps the document title and meta description in sync with the page. */
export function usePageMeta(title: string, description?: string) {
  const { pathname } = useLocation();
  useEffect(() => {
    // Marketing metadata is owned by usePublicSeoMeta, which matches the HTML sent to crawlers.
    if (publicPages.some(page => page.path === pathname)) return;
    const previousTitle = document.title;
    document.title = title ? `${title} — LanXgrow` : 'LanXgrow';

    let metaEl: HTMLMetaElement | null = null;
    let previousDescription: string | null = null;

    if (description) {
      metaEl = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!metaEl) {
        metaEl = document.createElement('meta');
        metaEl.name = 'description';
        document.head.appendChild(metaEl);
      }
      previousDescription = metaEl.content;
      metaEl.content = description;
    }

    return () => {
      document.title = previousTitle;
      if (metaEl && previousDescription !== null) {
        metaEl.content = previousDescription;
      }
    };
  }, [title, description, pathname]);
}
