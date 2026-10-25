import { useEffect, useRef, useState } from 'react';
import './FeatureJourney.css';

const features = [
  { name: 'Call', line: 'Speak with AI or a Human', body: 'Make room for real conversation. Find the confidence to speak, one exchange at a time.', src: '/images/product/learner-dashboard.jpg', alt: 'LanXgrow learning home showing the Call option', excerpt: true },
  { name: 'Practice', line: 'Build Skills Through Practice', body: 'Listen, read, write and speak. Small, purposeful exercises turn learning into an everyday habit.', src: '/images/product/daily-practice.jpg', alt: 'Daily Practice screen with listening, reading and writing exercises' },
  { name: 'Video Assessment', line: 'See How You Communicate', body: 'Put your thoughts into words. Record a response and take a closer look at how you communicate.', src: '/images/product/video-assessment.jpg', alt: 'Video Assessment screen showing the recording interface' },
  { name: 'English Pro Course', line: 'Follow a Clear Learning Path', body: 'Give your learning a direction, with course modules that help you take the next step.', src: '/Englis pro course.jpg', alt: 'English Pro Course screen with a lesson video and course modules' },
  { name: 'Learn & Entertainment', line: 'Learn Through What You Love', body: 'Discover English through stories, music, films and series that connect with your interests.', src: '/images/product/learner-dashboard.jpg', alt: 'LanXgrow learning home showing Learn and Entertainment', excerpt: true },
  { name: 'Dashboard', line: 'Keep Your Learning on Track', body: 'Bring your progress, reports and learning overview together, so you know where to go next.', src: '/Dashboard.jpg', alt: 'LanXgrow Dashboard with progress, reports and learning overview' },
];

export function WhyLanXgrow() {
  const track = useRef<HTMLDivElement>(null);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const shown = hovered ?? active;
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!track.current || window.matchMedia('(max-width: 767px), (max-height: 600px)').matches) return;
      const rect = track.current.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const p = Math.max(0, Math.min(1, (88 - rect.top) / Math.max(1, travel)));
      setProgress(p);
      setActive(Math.min(features.length - 1, Math.floor(p * features.length)));
    };
    const schedule = () => { setHovered(null); if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, []);
  const select = (index: number) => {
    if (!track.current) return;
    if (window.matchMedia('(max-width: 767px), (max-height: 600px)').matches) { setActive(index); setHovered(null); return; }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const top = window.scrollY + track.current.getBoundingClientRect().top - 88;
    const travel = track.current.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + travel * ((index + 0.35) / features.length), behavior: reduced ? 'instant' : 'smooth' });
  };
  return (
    <section id="why-lanxgrow" className="feature-journey" aria-labelledby="feature-heading">
      <div className="lx-container feature-intro">
        <div><p className="feature-eyebrow">Six things, held together</p><h2 id="feature-heading">Six Things,<br />Held Together.</h2></div>
        <p className="feature-intro-copy">LanXgrow brings every part of your English learning journey into one thoughtfully connected experience. From meaningful conversations and everyday practice to video assessments and a structured course, each part helps you move forward. Discover English through what you love, and bring your progress together in one place. Everything works in harmony to help you practise with purpose and take your next step towards confident communication.</p>
      </div>
      <div ref={track} className="feature-track">
        <div className="feature-sticky lx-container">
          <div className="feature-menu">
            <p className="feature-eyebrow">One connected experience <span> / 06</span></p>
            <div className="feature-list" aria-label="Explore LanXgrow features">
              {features.map((feature, index) => <button key={feature.name} type="button" className={`feature-option ${shown === index ? 'is-active' : ''}`} aria-current={shown === index ? 'step' : undefined} aria-controls="feature-preview" onMouseEnter={() => setHovered(index)} onMouseLeave={() => setHovered(null)} onFocus={() => setHovered(index)} onBlur={() => setHovered(null)} onClick={() => select(index)}><span className="feature-number">{String(index + 1).padStart(2, '0')}</span><span><span className="feature-name">{feature.name}</span><span className="feature-line">{feature.line}</span></span><span className="feature-arrow" aria-hidden="true">↗</span></button>)}
            </div>
            <p className="feature-scroll"><span aria-hidden="true">↓</span> Scroll to explore <span className="feature-progress"><span style={{ transform: `scaleX(${progress})` }} /></span></p>
          </div>
          <div id="feature-preview" className="feature-preview" onTouchStart={event => { const touch = event.touches[0]; if (touch) swipeStart.current = { x: touch.clientX, y: touch.clientY }; }} onTouchEnd={event => { const touch = event.changedTouches[0]; const start = swipeStart.current; swipeStart.current = null; if (!touch || !start || !window.matchMedia('(max-width: 767px)').matches) return; const dx = touch.clientX - start.x; const dy = touch.clientY - start.y; if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4) { setHovered(null); setActive(value => Math.max(0, Math.min(features.length - 1, value + (dx < 0 ? 1 : -1)))); } }} role="region" aria-label="Selected feature preview">
            <div className="feature-preview-top"><span>THE LANXGROW EXPERIENCE</span><span>{String(shown + 1).padStart(2, '0')} <span className="feature-total">/ 06</span></span></div>
            <div className="feature-stage">
              <span className="feature-orbit" aria-hidden="true" />
              {features.map((feature, index) => <div key={feature.name} className={`feature-slide ${shown === index ? 'is-active' : ''}`} aria-hidden={shown !== index}><img src={feature.src} alt={feature.alt} loading="eager" /><span className="feature-image-note">{feature.excerpt ? 'App home preview · dedicated screen coming next' : 'LanXgrow app · product preview'}</span></div>)}
            </div>
            <div className="feature-caption"><h3>{features[shown].name}</h3><p>{features[shown].body}</p></div>
          </div>
          <div className="feature-mobile-controls"><button type="button" disabled={active === 0} onClick={() => select(active - 1)} aria-label="Previous feature">←</button><p>Tap a feature or swipe the preview.<br />{active + 1} of {features.length}</p><button type="button" disabled={active === features.length - 1} onClick={() => select(active + 1)} aria-label="Next feature">→</button></div>
        </div>
      </div>
    </section>
  );
}
