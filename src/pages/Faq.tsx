import { useState } from 'react';
import './ExperiencePages.css';
import { faqIntro, faqItems } from '@/content/faq';
import { PageIntro } from '@/components/ui/PageIntro';
import { Section } from '@/components/ui/Section';
import { Accordion } from '@/components/ui/Accordion';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { cta } from '@/config/site';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function Faq() {
  usePageMeta('FAQ', 'Answers to common questions about LanXgrow.');
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('All questions');
  const groups: Record<string, string[]> = {
    'Speaking & confidence': ['why-cannot-speak-fluent','improve-speaking-skills','practice-without-partner','improve-pronunciation'],
    'AI & progress': ['can-ai-help','ai-feedback-reliable','measure-progress'],
    'Getting started': ['improve-for-interviews','programme-audience','programme-contents','cost-and-duration'],
    'Privacy': ['voice-data-use'],
  };
  const filtered = faqItems.filter(item => (topic === 'All questions' || groups[topic]?.includes(item.id)) && `${item.question} ${item.answer}`.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <>
      <PageIntro
        eyebrow={faqIntro.eyebrow}
        heading={faqIntro.heading}
        supporting={faqIntro.supporting}
      />

      <Section tone="ivory">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-8">
            <div className="faq-tools"><label htmlFor="faq-search" className="experience-kicker">Find your answer</label><input id="faq-search" className="faq-search" type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Try confidence, interviews or privacy…"/><div className="faq-filters" aria-label="Question topics">{['All questions',...Object.keys(groups)].map(label=><button key={label} type="button" aria-pressed={topic===label} onClick={()=>setTopic(label)}>{label}</button>)}</div><p className="faq-results" role="status">{filtered.length} {filtered.length===1?'answer':'answers'} to explore</p></div>
            {filtered.length ? <Accordion key={topic+query} items={filtered} defaultOpenId={filtered[0]?.id} /> : <div className="faq-empty"><p>No matching answers yet. Try a different word or browse all questions.</p><button type="button" className="login-back" onClick={()=>{setQuery('');setTopic('All questions');}}>Clear filters</button></div>}
          </Reveal>

          <Reveal delay={90} className="lg:col-span-4">
            <div className="faq-side">
              <div className="faq-side-mark" aria-hidden="true">?</div>
              <h2 className="font-display text-[1.375rem] text-ink-900">Still have a question?</h2>
              <p className="mt-3 text-[0.9375rem] leading-[1.7] text-ink-500">
                Send it to the LanXgrow team and we will help you work out the right next step.
              </p>
              <div className="mt-7">
                <Button to={cta.talkToUs.to} variant="secondary" withArrow>
                  Get started
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
