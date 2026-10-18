import { Route, Routes } from 'react-router-dom';
import { SiteLayout } from '@/components/layout/SiteLayout';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Services from '@/pages/Services';
import Faq from '@/pages/Faq';
import Contact from '@/pages/Contact';
import SignIn from '@/pages/SignIn';
import NotFound from '@/pages/NotFound';

/**
 * Public routes.
 *
 * Everything ships inside the shared `SiteLayout` shell so navigation and the
 * footer stay consistent. Stage 2 can add authenticated routes as sibling
 * trees without disturbing these pages.
 */
export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
