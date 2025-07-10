import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import MarketingTools from './components/MarketingTools';
import FinanceTools from './components/FinanceTools';
import StrategyTools from './components/StrategyTools';
import OperationsTools from './components/OperationsTools';
import ConversationalInterface from './components/ConversationalInterface';
import SettingsModal from './components/SettingsModal';
import PortfolioBuilder from './components/PortfolioBuilder';
import CRMDashboard from './components/CRMDashboard';
import TeamManagement from './components/TeamManagement';
import { database } from './lib/database';
import { emailService } from './lib/supabase';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  tier?: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showChat, setShowChat] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeApp();
    
    // Listen for settings modal
    const handleOpenSettings = () => setShowSettings(true);
    window.addEventListener('openSettings', handleOpenSettings);
    
    return () => {
      window.removeEventListener('openSettings', handleOpenSettings);
    };
  }, []);

  const initializeApp = async () => {
    setLoading(true);
    
    // Check for existing user session
    const savedUser = localStorage.getItem('aiBusinessUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setCurrentPage('dashboard');
      
      // Load user profile from database
      const { data: profile } = await database.getCurrentUser();
      if (profile) {
        setUser(profile);
        localStorage.setItem('aiBusinessUser', JSON.stringify(profile));
      }
    }
    
    setLoading(false);
  };

  const handleLogin = async (userData: User) => {
    setUser(userData);
    localStorage.setItem('aiBusinessUser', JSON.stringify(userData));
    setCurrentPage('dashboard');
    
    // Send welcome email
    await emailService.sendWelcomeEmail(userData.email, userData.name);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('aiBusinessUser');
    localStorage.removeItem('userTier');
    localStorage.removeItem('userTierUsage');
    setCurrentPage('landing');
    setActiveSection('dashboard');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard setActiveSection={setActiveSection} user={user} />;
      case 'marketing':
        return <MarketingTools />;
      case 'finance':
        return <FinanceTools />;
      case 'strategy':
        return <StrategyTools />;
      case 'operations':
        return <OperationsTools />;
      case 'portfolio':
        return <PortfolioBuilder user={user} />;
      case 'crm':
        return <CRMDashboard />;
      case 'team':
        return <TeamManagement user={user} />;
      default:
        return <Dashboard setActiveSection={setActiveSection} user={user} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your AI Business Assistant...</p>
        </div>
      </div>
    );
  }

  if (currentPage === 'landing') {
    return (
      <ThemeProvider>
        <LandingPage onGetStarted={() => setCurrentPage('auth')} />
      </ThemeProvider>
    );
  }

  if (currentPage === 'auth') {
    return (
      <ThemeProvider>
        <AuthPage onLogin={handleLogin} onBack={() => setCurrentPage('landing')} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 relative">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-slate-200 dark:border-gray-700"
        >
          <svg className="w-6 h-6 text-slate-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <div className="flex min-h-screen">
          <Sidebar 
            activeSection={activeSection} 
            setActiveSection={setActiveSection}
            setShowChat={setShowChat}
            user={user}
            onLogout={handleLogout}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <main className="flex-1 lg:ml-64 min-h-screen">
            <div className="p-4 md:p-8 pt-16 lg:pt-8">
              {renderContent()}
            </div>
          </main>
        </div>
        
        {showChat && (
          <ConversationalInterface 
            onClose={() => setShowChat(false)}
            user={user}
          />
        )}
        
        {showSettings && (
          <SettingsModal
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
            user={user}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;