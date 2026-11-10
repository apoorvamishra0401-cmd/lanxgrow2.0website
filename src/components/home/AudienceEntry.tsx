import { Link } from 'react-router-dom';
import './AudienceEntry.css';

/**
 * Website-only entry choices. Both routes open the no-account introduction.
 * The learner app's full, role-specific onboarding remains a separate integration.
 */
export function AudienceEntry() {
  return <section className="lx-audience" aria-labelledby="lx-audience-title">
    <div className="lx-audience-inner">
      <div className="lx-audience-heading">
        <p>YOUR FIRST STEP</p>
        <h2 id="lx-audience-title">Start where you are.<br /><em>Grow from there.</em></h2>
        <span>A short introduction, shaped around the conversations that matter to you.</span>
      </div>
      <div className="lx-audience-cards">
        <article className="lx-audience-card lx-audience-student">
          <div className="lx-audience-decor" aria-hidden="true"><span>01</span><i/></div>
          <div className="lx-audience-copy"><span className="lx-audience-kicker">ENGLISH FOR EVERYDAY CONFIDENCE</span><h3>For Students</h3><p>Build clarity for presentations, classroom discussions, group projects and the conversations ahead.</p></div>
          <Link to="/?start=intro&audience=student" className="lx-audience-link">Try the free 1-minute interview <span aria-hidden="true">↗</span></Link>
        </article>
        <article className="lx-audience-card lx-audience-career">
          <div className="lx-audience-decor" aria-hidden="true"><span>02</span><i/></div>
          <div className="lx-audience-copy"><span className="lx-audience-kicker">ENGLISH FOR YOUR NEXT OPPORTUNITY</span><h3>For Freshers &amp; Professionals</h3><p>Introduce yourself, describe your experience and find a clearer voice for interviews and work.</p></div>
          <Link to="/?start=intro&audience=fresher" className="lx-audience-link">Try the free 1-minute interview <span aria-hidden="true">↗</span></Link>
        </article>
      </div>
    </div>
  </section>;
}
