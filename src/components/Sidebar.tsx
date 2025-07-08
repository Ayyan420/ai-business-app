import React from 'react';
import { 
  BarChart3, 
  Brain, 
  DollarSign, 
  Home, 
  MessageCircle, 
  Settings, 
  Target, 
  TrendingUp,
  LogOut,
  User
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  setShowChat: (show: boolean) => void;
  user: { id: string; name: string; email: string; avatar?: string } | null;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection, setShowChat, user, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'marketing', label: 'Marketing', icon: TrendingUp },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'strategy', label: 'Strategy', icon: Target },
    { id: 'operations', label: 'Operations', icon: BarChart3 },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-slate-200 z-40">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">AI Business</h1>
            <p className="text-sm text-slate-500">Assistant</p>
          </div>
        </div>
        
        {/* User Profile */}
        {user && (
          <div className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center space-x-3">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
              ) : (
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === item.id
                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-200">
        <button
          onClick={() => setShowChat(true)}
          className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">AI Assistant</span>
        </button>
        
        <button className="w-full flex items-center space-x-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;