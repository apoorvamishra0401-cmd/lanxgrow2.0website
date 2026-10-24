import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import './ResearchStories.css';

const studies = [
  { audience: 'School-age learners', kicker: 'Foundations before fluency', figure: '57.3', unit: '%', title: 'A starting point is not a limit.', finding: 'In ASER 2023’s surveyed sample, 57.3% of rural youth aged 14–18 could read sentences in English.', scope: '34,745 youth across 28 rural districts in 26 states. This is an English-reading result, not a speaking assessment or a finding specifically about Class XI–XII students.', idea: 'Our perspective: make room to read, understand and then explain an idea in your own words.', source: 'ASER Centre · Beyond Basics, 2023', url: 'https://asercentre.org/wp-content/uploads/2022/12/ASER-2023_Main-findings-1.pdf', art: 'reading' },
  { audience: 'Graduates & first-job seekers', kicker: 'Beyond the qualification', figure: '42.6', unit: '%', title: 'Bring your knowledge into the conversation.', finding: 'Mercer’s India’s Graduate Skill Index 2025 reports 42.6% overall employability among Indian graduates applying for jobs.', scope: 'The report draws on assessments of over one million students across 2,700+ campuses. Overall employability covers multiple skills; this figure does not measure English proficiency or predict an individual’s job prospects.', idea: 'Our perspective: practise explaining a project, answering a follow-up and making your contribution clear.', source: 'Mercer · India’s Graduate Skill Index, 2025', url: 'https://www.mercer.com/insights/talent-and-transformation/talent-assessment/indias-graduate-skill-index-2025/', art: 'career' },
  { audience: 'Working professionals', kicker: 'The human side of work', figure: 'Human', unit: 'skills', title: 'Good work needs a clear voice.', finding: 'The World Economic Forum lists empathy and active listening among employers’ top ten core skills in its Future of Jobs Report 2025.', scope: 'A global employer survey covering over 1,000 employers across 55 economies. These are employer priorities, not a test of Indian professionals’ English or evidence of LanXgrow outcomes.', idea: 'Our perspective: practise listening closely, explaining decisions and moving a conversation forward.', source: 'World Economic Forum · Future of Jobs, 2025', url: 'https://www.weforum.org/publications/the-future-of-jobs-report-2025/3-skills-outlook', art: 'work' },
];

function ResearchArt({ kind }: { kind: string }) {
  return <svg viewBox="0 0 300 170" className="research-art" fill="none" aria-hidden="true">
    {kind==='reading'?<><ellipse cx="150" cy="135" rx="100" ry="15" fill="#bc8963" opacity=".12"/><path d="M54 44q47-23 96 10 49-33 96-10v80q-49-20-96 9-47-29-96-9Z" fill="#f9f1e1" stroke="#b68b68" strokeWidth="2"/><path d="M150 54v79M74 67q28-8 56 8M74 86q28-8 56 8M74 105q28-8 56 8M170 75q28-16 56-8M170 94q28-16 56-8" stroke="#b58a67" strokeWidth="2"/><g className="research-float"><rect x="184" y="16" width="55" height="39" rx="10" fill="#ad6645"/><path d="m200 55-7 10 22-10" fill="#ad6645"/><path d="M197 30h28M197 39h18" stroke="#fff3de" strokeWidth="2" strokeLinecap="round"/></g></>:
    kind==='career'?<><rect x="69" y="37" width="155" height="109" rx="12" fill="#ead7ba" stroke="#b48a61"/><rect x="84" y="25" width="126" height="109" rx="10" fill="#fffaee" stroke="#c6a986"/><path d="M107 49h80M107 62h59M107 83h80M107 96h48M107 109h66" stroke="#bb9b78" strokeWidth="3" strokeLinecap="round"/><g className="research-float"><circle cx="224" cy="53" r="25" fill="#a86a48"/><path d="m213 53 8 8 15-17" stroke="#fff1dc" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></g><path d="M44 137h214" stroke="#c7ae8c" strokeWidth="2"/></>:
    <><ellipse cx="150" cy="143" rx="106" ry="13" fill="#ba8963" opacity=".12"/><path d="M47 46q0-15 15-15h105q15 0 15 15v47q0 15-15 15H95l-20 20 3-20H62q-15 0-15-15Z" fill="#fff7e8" stroke="#bc9673" strokeWidth="2"/><g className="research-float"><path d="M139 83q0-12 12-12h87q12 0 12 12v36q0 12-12 12h-22l-14 15v-15h-51q-12 0-12-12Z" fill="#a76543"/><path d="M158 90h72M158 101h55M158 112h38" stroke="#f6e5c9" strokeWidth="2" strokeLinecap="round"/></g><path d="M68 56h85M68 70h62M68 84h43" stroke="#b39573" strokeWidth="3" strokeLinecap="round"/></>}
  </svg>;
}

export function ResearchStories() {
  return <section className="research-section" aria-labelledby="research-heading">
    <div className="lx-container">
      <Reveal className="research-intro"><div><p className="research-eyebrow">A reason to practise</p><h2 id="research-heading">Different chapters.<br/>A voice that grows with you.</h2></div><p>From the classroom to the workplace, the context changes. The need to understand and be understood stays. Here’s what three independent reports bring into focus.</p></Reveal>
      <div className="research-stack">
        {studies.map((study,index)=><article key={study.art} className={`research-card research-card-${index}`}>
          <Reveal className="research-card-inner">
            <div className="research-poster"><span className="research-index">0{index+1} / 03</span><p className="research-audience">{study.audience}</p><div className="research-figure"><span>{study.figure}</span><span>{study.unit}</span></div><ResearchArt kind={study.art}/><p className="research-kicker">{study.kicker}</p></div>
            <div className="research-copy"><h3>{study.title}</h3><p className="research-finding">{study.finding}</p><p className="research-scope">{study.scope}</p><p className="research-idea">{study.idea}</p><a href={study.url} target="_blank" rel="noopener noreferrer" className="research-source">{study.source}<span aria-hidden="true"> ↗</span></a></div>
          </Reveal>
        </article>)}
      </div>
      <div className="research-end"><p>Independent research informs the context. Your journey is your own.</p><Button to="/get-started" withArrow>Find your starting point</Button></div>
    </div>
  </section>;
}
