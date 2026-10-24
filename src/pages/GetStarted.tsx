import { Link } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import './GetStarted.css';

export default function GetStarted() {
  useScrollToTop();
  usePageMeta('Get started', 'Build your confidence, express your thoughts, and communicate better every day with LanXgrow.');
  return (
    <main className="lx-welcome" aria-labelledby="welcome-heading">
      <Link to="/" className="lx-welcome-back"><span aria-hidden="true">←</span> Back to website</Link>
      <Link className="lx-welcome-brand" to="/" aria-label="LanXgrow home">Lan<span className="lx-welcome-x">X<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21C7 11 11 5 22 3c-1 11-7 16-14 14M8 17l9-9" /></svg></span>grow</Link>
      <div className="lx-welcome-story">
        <svg className="lx-welcome-art" viewBox="0 0 220 200" fill="none" aria-hidden="true">
          <g stroke="currentColor" strokeWidth=".85"><ellipse cx="110" cy="100" rx="65" ry="85" transform="rotate(42 110 100)" /><ellipse cx="110" cy="100" rx="62" ry="80" transform="rotate(-27 110 100)" /><ellipse cx="110" cy="100" rx="70" ry="65" /><path fill="var(--welcome-paper)" d="M104 71c-27-17-62-3-65 24-2 16 7 27 16 32l-9 22 27-14c14 4 27 2 38-5" /><path fill="var(--welcome-paper)" d="M111 73c28-16 64-2 67 23 2 15-5 28-16 35l11 22-28-14c-30 7-54-7-56-31-1-15 8-28 22-35Z" /><path d="M76 90c-12 3-17 16-13 24 3 6 11 6 13 0 2-5-2-9-7-8 1-5 4-8 8-10l-1-6Zm55 27c12-3 17-16 13-24-3-6-11-6-13 0-2 5 2 9 7 8-1 5-4 8-8 10l1 6Zm21 0c12-3 17-16 13-24-3-6-11-6-13 0-2 5 2 9 7 8-1 5-4 8-8 10l1 6Z" /></g>
        </svg>
        <h1 id="welcome-heading">Let’s become a<br className="lx-welcome-break" /> confident English<br className="lx-welcome-break" /> speaker.</h1>
        <p>Build your confidence, express your<br className="lx-welcome-break" /> thoughts, and communicate better<br className="lx-welcome-break" /> every day.</p>
      </div>
      <div className="lx-welcome-actions">
        <Link to="/signin" className="lx-welcome-cta">Let’s Get Started <span aria-hidden="true">→</span></Link>
        <p>Your learning journey will be personalized to your goals.</p>
      </div>
    </main>
  );
}
