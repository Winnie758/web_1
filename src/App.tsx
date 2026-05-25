
import React, { useState } from 'react';
import { useAuthStore } from './store/authStore';
import PublicHomepage from './components/PublicHomepage';
import LoginModal from './components/LoginModal';
import DashboardLayout from './components/DashboardLayout';

export default function App() {
  const { isAuthenticated } = useAuthStore();
  const [showLogin, setShowLogin] = useState(false);

  if (isAuthenticated) {
    return <DashboardLayout />;
  }

  return (
    <>
      <PublicHomepage onLoginClick={() => setShowLogin(true)} />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}
