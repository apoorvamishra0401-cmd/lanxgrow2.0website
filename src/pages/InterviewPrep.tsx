import { useEffect, useRef } from 'react';
import originalDocument from '@/content/interview-original.html?raw';
import { initializeInterviewStory } from './interviewStory';
import { usePageMeta } from '@/hooks/usePageMeta';

/** Interview Prep is a real React route with the same SiteLayout/Header/Footer.
 * The original five-stage artwork and long-form editorial copy are preserved
 * inside a style-isolated page body until each section is migrated separately.
 */
export default function InterviewPrep() {
  usePageMeta('Interview Prep', 'Practice interviews and develop confident professional communication with LanXgrow.');
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const shadow = element.shadowRoot ?? element.attachShadow({ mode: 'open' });
    const documentCopy = new DOMParser().parseFromString(originalDocument, 'text/html');
    const sheets = Array.from(documentCopy.head.querySelectorAll('style'));
    const page = documentCopy.querySelector('main#main');
    const template = documentCopy.querySelector('#interview-story-template');
    shadow.replaceChildren();
    const extra = document.createElement('style');
    extra.textContent = ':host{display:block;background:#faf7f2;color:#1d1a16;font:16px/1.75 Inter,system-ui,sans-serif}main{display:block}';
    shadow.appendChild(extra);
    for (const sheet of sheets) shadow.appendChild(sheet.cloneNode(true));
    if (page) shadow.appendChild(page.cloneNode(true));
    if (template) shadow.appendChild(template.cloneNode(true));
    // Navigation remains in React: redirect all entry CTAs to a single diagnostic.
    const onClick = (event: Event) => {
      const origin = (event.target as Element).closest('a[href="/get-started"],a[href="/signin"],a[href="/signup"]');
      if (origin) { event.preventDefault(); window.history.pushState({}, '', '/diagnostic'); window.dispatchEvent(new PopStateEvent('popstate')); }
    };
    shadow.addEventListener('click', onClick);
    const trackButtons = [...shadow.querySelectorAll<HTMLElement>('[data-track]')];
    const onTrack = (event: Event) => {
      const button = event.currentTarget as HTMLElement;
      trackButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      shadow.querySelectorAll<HTMLElement>('[data-group]').forEach(group => { group.hidden = button.dataset.track !== 'all' && group.dataset.group !== button.dataset.track; });
    };
    trackButtons.forEach(button => button.addEventListener('click', onTrack));
    const disposeStory = initializeInterviewStory(shadow);
    return () => { shadow.removeEventListener('click', onClick); trackButtons.forEach(button => button.removeEventListener('click', onTrack)); disposeStory(); };
  }, []);
  return <div ref={host} className="w-full" aria-label="LanXgrow Interview Preparation" />;
}
