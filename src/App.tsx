import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { FloatingWhatsApp } from '@/components/support/SupportLinks';
import { PwaStatus } from '@/components/support/PwaStatus';
import { Header } from '@/components/layout/Header';
import { SiteLayout } from '@/components/layout/SiteLayout';
import Home from '@/pages/Home';
import ReviewGate from '@/learner/ReviewGate';
import { lazy, Suspense } from 'react';
const VerifiedAccount = lazy(() => import('@/auth/VerifiedAccount'));
const ReviewAccountPage = lazy(() => import('@/learner/reviewAccount'));
const SmartAI = lazy(() => import('@/smart/SmartAI'));
const SmartDeviceReview = lazy(() => import('@/smart/DeviceReview'));
const PracticeReview = lazy(() => import('@/learner/PracticeReview'));
const AssessmentFlow = lazy(() => import('@/learner/assessment/AssessmentFlow'));
const AdminReview = lazy(() => import('@/learner/AdminReview'));
const LearnerPreview = lazy(() => import('@/learner/LearnerPreview'));
import GetStarted from '@/pages/GetStarted';
import About from '@/pages/About';
import Services from '@/pages/Services';
import Faq from '@/pages/Faq';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import Consent from '@/pages/Consent';
import Terms from '@/pages/Terms';
import ResetPassword from '@/pages/ResetPassword';
import AuthCallback from '@/pages/AuthCallback';
import Placeholder from '@/pages/Placeholder';
import Account from '@/pages/Account';
import Privacy from '@/pages/Privacy';
import NotFound from '@/pages/NotFound';

/**
 * Public routes.
 *
 * Everything ships inside the shared `SiteLayout` shell so navigation and the
 * footer stay consistent.
 */
export default function App() {
  const { pathname } = useLocation();
  const review = import.meta.env.VITE_SMART_SHOWCASE === 'true';
  const verifiedAuth = import.meta.env.VITE_AUTH_VERIFICATION === 'true';
  return (
    <>
    {!pathname.startsWith('/design-review') && !pathname.startsWith('/smart-ai') && pathname !== '/assessment-preview' && pathname !== '/app-preview' && pathname !== '/practice-preview' && <FloatingWhatsApp />}
    <PwaStatus />
    {['/smart-ai','/get-started','/signin','/signup','/consent'].includes(pathname) && <div className="lx-shared-header"><Header /></div>}
    <Routes>
      {import.meta.env.VITE_SMART_SHOWCASE === 'true' && <Route path="/practice-preview" element={<Suspense fallback={<p>Opening Practice…</p>}><PracticeReview /></Suspense>} />}
      {import.meta.env.VITE_SMART_SHOWCASE === 'true' && <Route path="/smart-ai/review" element={<Suspense fallback={<p>Preparing device review…</p>}><SmartDeviceReview /></Suspense>} />}
      {import.meta.env.VITE_SMART_SHOWCASE === 'true' && <Route path="/app-preview" element={<Suspense fallback={<p>Opening your learning space…</p>}><ReviewGate><LearnerPreview /></ReviewGate></Suspense>} />}
      {import.meta.env.VITE_SMART_SHOWCASE === 'true' && <Route path="/assessment-preview" element={<Suspense fallback={<p>Opening Lan-X…</p>}><Navigate to="/app-preview?begin=1" replace /></Suspense>} />}
      {review && <Route path="/design-review/assessment" element={<Suspense fallback={<p>Opening screen review…</p>}><AssessmentFlow reviewMode /></Suspense>} />}
      {review && <Route path="/design-review/admin" element={<Suspense fallback={<p>Opening admin design…</p>}><AdminReview /></Suspense>} />}
      <Route path="/smart-ai" element={<Suspense fallback={<main style={{background:'#080c11',color:'#fff',minHeight:'100svh',padding:30}}>Preparing SMART AI…</main>}><SmartAI /></Suspense>} />
      <Route path="/get-started" element={<GetStarted />} />
      <Route path="/signin" element={verifiedAuth?<Suspense fallback={<p>Opening account…</p>}><VerifiedAccount mode="signin"/></Suspense>:review?<Suspense fallback={<p>Opening sign in…</p>}><ReviewAccountPage mode="signin"/></Suspense>:<SignIn />} />
      <Route path="/signup" element={verifiedAuth?<Suspense fallback={<p>Opening account…</p>}><VerifiedAccount mode="signup"/></Suspense>:review?<Suspense fallback={<p>Opening account setup…</p>}><ReviewAccountPage mode="signup"/></Suspense>:<SignUp />} />
      <Route path="/consent" element={<Consent />} />
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact/*" element={<Navigate to="/get-started" replace />} />
        <Route path="/contact-us/*" element={<Navigate to="/get-started" replace />} />
        <Route path="/forgot-password" element={verifiedAuth?<Suspense fallback={<p>Opening account…</p>}><VerifiedAccount mode="reset"/></Suspense>:review?<Suspense fallback={<p>Opening account recovery…</p>}><ReviewAccountPage mode="reset"/></Suspense>:<ResetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth-callback" element={<AuthCallback />} />
        <Route path="/placeholder" element={<Placeholder />} />
        <Route path="/account" element={<Account />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
    </>
  );
}
