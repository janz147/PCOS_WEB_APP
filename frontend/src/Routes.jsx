import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import PCOSCareDashboard from './pages/pcos-care-dashboard';
import AboutPage from './pages/about';
import QuizPage from './pages/quiz';
import ClinicsNearMe from './pages/clinics-near-me';
import FactsAndMythsPage from './pages/facts-and-myths';
import TermsModal from './components/ui/TermsModal';

const TERMS_ACCEPTED_KEY = 'pcos_care_terms_accepted';

const RoutesWrapper = () => {
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(TERMS_ACCEPTED_KEY);
    if (!accepted) {
      setShowTerms(true);
    }
  }, []);

  const handleTermsAccept = () => {
    localStorage.setItem(TERMS_ACCEPTED_KEY, 'true');
    setShowTerms(false);
  };

  return (
    <>
      <TermsModal isOpen={showTerms} onAccept={handleTermsAccept} onClose={() => setShowTerms(false)} />
      <RouterRoutes>
        {/* Define your route here */}
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
