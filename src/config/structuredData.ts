import { publicPages, siteOrigin } from './seo';
import { contactChannels } from './site';

/** Only verified public identity and page facts; no ratings or outcome claims. */
export function structuredData(path: string) {
  const page = publicPages[path];
  if (!page) return null;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': `${siteOrigin}/#organization`, name: 'LanXgrow', url: `${siteOrigin}/`, email: contactChannels.email },
      { '@type': 'WebSite', '@id': `${siteOrigin}/#website`, name: 'LanXgrow', url: `${siteOrigin}/`, publisher: { '@id': `${siteOrigin}/#organization` } },
      { '@type': 'WebPage', '@id': `${siteOrigin}${path}#webpage`, url: `${siteOrigin}${path}`, name: `${page.title} — LanXgrow`, description: page.description, isPartOf: { '@id': `${siteOrigin}/#website` }, inLanguage: 'en' },
    ],
  };
}
