import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { publicPages, siteOrigin } from '@/config/seo';

export function usePageMeta(title: string, description?: string) {
  const { pathname } = useLocation();
  useEffect(() => {
    const path = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
    const page = publicPages[path];
    const fullTitle = `${page?.title ?? title} — LanXgrow`;
    document.title = fullTitle;
    function meta(name: string, content: string, property = false) {
      const attr = property ? 'property' : 'name';
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.content = content;
    }
    meta('description', page?.description ?? description ?? 'LanXgrow English communication practice.');
    meta('robots', page ? 'index,follow' : 'noindex,follow');
    meta('og:title', fullTitle, true);
    meta('og:description', page?.description ?? description ?? '', true);
    meta('og:url', siteOrigin + path, true);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (page) {
      if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
      canonical.href = siteOrigin + path;
    } else canonical?.remove();
  }, [title, description, pathname]);
}
