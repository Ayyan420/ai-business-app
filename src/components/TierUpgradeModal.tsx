import React from 'react';
import React, { useState } from 'react';
import { X, Check, Crown, Zap } from 'lucide-react';
import { TIERS, UserTier } from '../lib/tiers';
import PaymentModal from './PaymentModal';

interface TierUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFeature: string;
}

const TierUpgradeModal: React.FC<TierUpgradeModalProps> = ({ isOpen, onClose, currentFeature }) => {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedTierForPayment, setSelectedTierForPayment] = useState('');
  
  if (!isOpen) return null;

  const handleUpgrade = (tierName: string) => {
    if (tierName === 'free') return;
    
    setSelectedTierForPayment(tierName);
    setShowPayment(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Upgrade Your Plan</h2>
              <p className="text-slate-600 mt-1">You've reached the limit for {currentFeature}. Upgrade to continue!</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(TIERS).map(([key, tier]) => (
              <div
                key={key}
                className={`relative p-6 rounded-xl border-2 ${
                  key === 'pro' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-slate-200 bg-white'
                }`}
              >
                {key === 'pro' && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                      <Crown className="w-4 h-4" />
                      <span>Most Popular</span>
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{tier.name}</h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-3xl font-bold text-slate-800">${tier.price}</span>
                    <span className="text-slate-600 ml-1">/month</span>
                  </div>
                  <p className="text-sm text-slate-600">Perfect for growing businesses</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Content Generations:</span>
                    <span className="font-medium">
                      {tier.limits.contentGenerations === -1 ? 'Unlimited' : tier.limits.contentGenerations}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Invoices:</span>
                    <span className="font-medium">
                      {tier.limits.invoices === -1 ? 'Unlimited' : tier.limits.invoices}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Campaigns:</span>
                    <span className="font-medium">
                      {tier.limits.campaigns === -1 ? 'Unlimited' : tier.limits.campaigns}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleUpgrade(key)}
                  disabled={key === 'free'}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    key === 'free'
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : key === 'pro'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-slate-800 text-white hover:bg-slate-900'
                  }`}
                >
                  {key === 'free' ? 'Current Plan' : `Upgrade to ${tier.name}`}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-green-800">Pakistan-Friendly Pricing</h4>
            </div>
            <p className="text-green-700 text-sm">
              Our pricing is designed to be affordable for Pakistani businesses. All payments are processed 
              securely and support local payment methods including JazzCash, EasyPaisa, and bank transfers.
            </p>
          </div>
        </div>
      </div>
      
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        selectedTier={selectedTierForPayment}
        user={{ id: 'demo-user', name: 'Demo User', email: 'demo@example.com' }}
      />
    </div>
  );
};

export default TierUpgradeModal;