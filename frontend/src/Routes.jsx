import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes as RouterRoutes,
  Route,
  useLocation,
} from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import PCOSCareDashboard from './pages/pcos-care-dashboard';
import AboutPage from './pages/about';
import QuizPage from './pages/quiz';
import ClinicsNearMe from './pages/clinics-near-me';
import FactsAndMythsPage from './pages/facts-and-myths';
import TermsModal from './components/ui/TermsModal';

const RoutesWrapper = () => {
  const location = useLocation();
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    const isDashboardPage =
      location.pathname === "/" ||
      location.pathname === "/pcos-care-dashboard";

    setShowTerms(isDashboardPage);
  }, [location.pathname]);

  const handleTermsAccept = () => {
    setShowTerms(false);
  };

  return (
    <>
      <TermsModal
        isOpen={showTerms}
        onAccept={handleTermsAccept}
        onClose={() => setShowTerms(false)}
      />

      <RouterRoutes>
        <Route path="/" element={<PCOSCareDashboard />} />
        <Route path="/pcos-care-dashboard" element={<PCOSCareDashboard />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/clinics-near-me" element={<ClinicsNearMe />} />
        <Route path="/facts-and-myths" element={<FactsAndMythsPage />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
    </>
  );
};

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RoutesWrapper />
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;