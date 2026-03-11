import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import PCOSCareDashboard from './pages/pcos-care-dashboard';
import AboutPage from './pages/about';
import QuizPage from './pages/quiz';
import ClinicsNearMe from './pages/clinics-near-me';

const RoutesWrapper = () => {
  return (
    <RouterRoutes>
      {/* Define your route here */}
      <Route path="/" element={<PCOSCareDashboard />} />
      <Route path="/pcos-care-dashboard" element={<PCOSCareDashboard />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/clinics-near-me" element={<ClinicsNearMe />} />
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
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
