import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Pages
import Home from './pages/Home';
import WebsiteDetail from './pages/WebsiteDetail';
import MobileDetail from './pages/MobileDetail';
import SchoolDetail from './pages/SchoolDetail';
import CustomDevDetail from './pages/CustomDevDetail';
import HospitalDetail from './pages/HospitalDetail';
import ClientPortal from './pages/ClientPortal';
import AdminDashboard from './pages/AdminDashboard';
import KniteMeetPage from './pages/KniteMeetPage';
import AdminClientWorkspace from './pages/AdminClientWorkspace';
import CommandPalette from './components/CommandPalette';

// App wrapper to handle location-based logic
const AppContent = () => {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email?.toLowerCase() === 'kniteinfotech@gmail.com') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services/website" element={<WebsiteDetail />} />
        <Route path="/services/mobile" element={<MobileDetail />} />
        <Route path="/services/school" element={<SchoolDetail />} />
        <Route path="/services/custom-dev" element={<CustomDevDetail />} />
        <Route path="/services/hospital" element={<HospitalDetail />} />
        <Route path="/portal" element={<ClientPortal />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/client/:clientId" element={<AdminClientWorkspace />} />
        <Route path="/meet" element={<KniteMeetPage />} />
      </Routes>
      <CommandPalette isOpen={isCommandOpen} setIsOpen={setIsCommandOpen} isAdmin={isAdmin} />
    </>
  );
};

import { HelmetProvider } from 'react-helmet-async';

const App = () => {
  return (
    <HelmetProvider>
      <Router>
        <AppContent />
      </Router>
    </HelmetProvider>
  );
};

export default App;
