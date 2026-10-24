import { Navigate, Route, Routes } from 'react-router-dom';
import { FloatingWhatsApp } from '@/components/support/SupportLinks';
import { PwaStatus } from '@/components/support/PwaStatus';
import { SiteLayout } from '@/components/layout/SiteLayout';
import Home from '@/pages/Home';
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
  return (
    <>
    <FloatingWhatsApp />
    <PwaStatus />
    <Routes>
      <Route path="/get-started" element={<GetStarted />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/consent" element={<Consent />} />
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact/*" element={<Navigate to="/get-started" replace />} />
        <Route path="/contact-us/*" element={<Navigate to="/get-started" replace />} />
        <Route path="/forgot-password" element={<ResetPassword />} />
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
