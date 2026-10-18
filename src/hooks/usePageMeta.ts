import { useEffect } from 'react';

/** Keeps the document title and meta description in sync with the page. */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
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
  }, [title, description]);
}
