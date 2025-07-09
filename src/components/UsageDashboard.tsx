import React from 'react';
import { TierManager, TIERS } from '../lib/tiers';
import { Crown, Zap, BarChart3 } from 'lucide-react';

const UsageDashboard: React.FC = () => {
  const currentTier = TierManager.getCurrentTier();
  const tierInfo = TIERS[currentTier];
  const usage = TierManager.getUsage();

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const usageItems = [
    { key: 'contentGenerations', label: 'Content Generations', icon: Zap },
    { key: 'invoices', label: 'Invoices', icon: BarChart3 },
    { key: 'campaigns', label: 'Campaigns', icon: Crown },
    { key: 'tasks', label: 'Tasks', icon: BarChart3 },
    { key: 'aiQueries', label: 'AI Queries', icon: Zap },
    { key: 'pdfExports', label: 'PDF Exports', icon: BarChart3 }
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Usage Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Crown className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">{tierInfo.name} Plan</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {usageItems.map((item) => {
          const IconComponent = item.icon;
          const used = usage[item.key as keyof typeof usage] || 0;
          const limit = tierInfo.limits[item.key as keyof typeof tierInfo.limits];
          const percentage = getUsagePercentage(used, limit);

          return (
            <div key={item.key} className="p-4 bg-slate-50 rounded-lg border">
              <div className="flex items-center space-x-2 mb-2">
                <IconComponent className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">{item.label}</span>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold text-slate-800">{used}</span>
                <span className="text-sm text-slate-600">
                  / {limit === -1 ? '∞' : limit}
                </span>
              </div>

              {limit !== -1 && (
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(percentage)}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {currentTier === 'free' && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">Upgrade for More Features</h3>
          <p className="text-blue-700 text-sm mb-3">
            Get unlimited access to all features with our affordable Pro plan starting at just $9.99/month.
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            onClick={() => {
              const modal = document.createElement('div');
              modal.innerHTML = `
                <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div class="bg-white p-6 rounded-lg max-w-md">
                    <h3 class="text-lg font-bold mb-4">Upgrade to Pro</h3>
                    <p class="mb-4">Get unlimited access for just $9.99/month</p>
                    <div class="flex space-x-2">
                      <button onclick="this.closest('.fixed').remove(); localStorage.setItem('userTier', 'pro'); alert('Upgraded to Pro! (Demo mode)'); window.location.reload();" class="px-4 py-2 bg-blue-600 text-white rounded">Upgrade</button>
                      <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                    </div>
                  </div>
                </div>
              `;
              document.body.appendChild(modal);
            }}
            Upgrade Now
          </button>
        </div>
      )}
    </div>
  );
};

export default UsageDashboard;