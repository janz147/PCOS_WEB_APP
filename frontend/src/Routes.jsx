import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import PCOSCareDashboard from './pages/pcos-care-dashboard';
import AboutPage from './pages/about';
import QuizPage from './pages/quiz';
import ClinicsNearMe from './pages/clinics-near-me';
import LoadingScreen from './components/ui/LoadingScreen';

const RoutesWrapper = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [location?.pathname]);

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<PCOSCareDashboard />} />
        <Route path="/pcos-care-dashboard" element={<PCOSCareDashboard />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/clinics-near-me" element={<ClinicsNearMe />} />
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
