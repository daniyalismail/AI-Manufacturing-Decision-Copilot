import React, { useState, useEffect } from 'react';
import { Header } from './components/shell/Header';
import { Footer } from './components/shell/Footer';
import { EvidenceDrawer } from './components/evidence/EvidenceDrawer';

import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { NewProjectPage } from './pages/NewProjectPage';
import { ProjectWorkspacePage } from './pages/ProjectWorkspacePage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>('/dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Sync state with browser location
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname || '/dashboard';
      setCurrentPath(path === '/' ? '/dashboard' : path);
    };

    window.addEventListener('popstate', handlePopState);
    handlePopState();

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render Page Content based on Path
  const renderPage = () => {
    if (!isAuthenticated || currentPath === '/login') {
      return (
        <LoginPage
          onLoginSuccess={() => {
            setIsAuthenticated(true);
            navigate('/dashboard');
          }}
        />
      );
    }

    if (currentPath === '/' || currentPath === '/dashboard') {
      return <DashboardPage onNavigate={navigate} />;
    }

    if (currentPath === '/projects') {
      return <ProjectsPage onNavigate={navigate} />;
    }

    if (currentPath === '/projects/new') {
      return <NewProjectPage onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/projects/')) {
      const projectId = currentPath.replace('/projects/', '');
      return <ProjectWorkspacePage projectId={projectId} onNavigate={navigate} />;
    }

    if (currentPath === '/settings') {
      return <SettingsPage />;
    }

    // Default Fallback
    return <DashboardPage onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen bg-cream-paper text-ink-black flex flex-col font-inter selection:bg-fresh-grass/30">
      {/* Global Floating Navigation Header */}
      <Header currentPath={currentPath} onNavigate={navigate} />

      {/* Main Page Container */}
      <main className="pt-[120px] pb-20 px-4 md:px-8 max-w-[1240px] mx-auto w-full flex-grow">
        {renderPage()}
      </main>

      {/* Global Audit Evidence Drawer Modal */}
      <EvidenceDrawer />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
