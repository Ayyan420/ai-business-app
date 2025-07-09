import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import MarketingTools from './components/MarketingTools';
import FinanceTools from './components/FinanceTools';
import StrategyTools from './components/StrategyTools';
import OperationsTools from './components/OperationsTools';
import ConversationalInterface from './components/ConversationalInterface';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showChat, setShowChat] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('aiBusinessUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentPage('dashboard');
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('aiBusinessUser', JSON.stringify(userData));
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('aiBusinessUser');
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
      default:
        return <Dashboard setActiveSection={setActiveSection} user={user} />;
    }
  };

  if (currentPage === 'landing') {
    return <LandingPage onGetStarted={() => setCurrentPage('auth')} />;
  }

  if (currentPage === 'auth') {
    return <AuthPage onLogin={handleLogin} onBack={() => setCurrentPage('landing')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-slate-200"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    </div>
  );
}

export default App;