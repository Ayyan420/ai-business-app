import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Building, Shield, Check } from 'lucide-react';
import { PAYMENT_METHODS, PaymentProcessor } from '../lib/payments';
import { TIERS } from '../lib/tiers';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTier: string;
  user: any;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, selectedTier, user }) => {
  const [selectedMethod, setSelectedMethod] = useState('jazzcash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: method selection, 2: details, 3: confirmation

  if (!isOpen) return null;

  const tier = TIERS[selectedTier];
  const method = PAYMENT_METHODS.find(m => m.id === selectedMethod);
  const total = method ? PaymentProcessor.calculateTotal(tier.price, selectedMethod) : tier.price;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      const result = await PaymentProcessor.processPayment(
        total,
        'USD',
        selectedMethod,
        { ...user, selectedTier }
      );
      
      if (result.success) {
        // Update user tier
        localStorage.setItem('userTier', selectedTier);
        alert(`Payment successful! Welcome to ${tier.name} plan. Transaction ID: ${result.transactionId}`);
        onClose();
        window.location.reload();
      } else {
        alert(`Payment failed: ${result.error}`);
      }
    } catch (error) {
      alert('Payment processing error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'card': return CreditCard;
      case 'mobile': return Smartphone;
      case 'bank': return Building;
      default: return CreditCard;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Complete Payment</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Order Summary */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">{tier.name} Plan</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Monthly subscription:</span>
                <span className="text-blue-800">${tier.price.toFixed(2)}</span>
              </div>
              {method && method.fees > 0 && (
                <div className="flex justify-between">
                  <span className="text-blue-700">Processing fee ({(method.fees * 100).toFixed(1)}%):</span>
                  <span className="text-blue-800">${(tier.price * method.fees).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold border-t border-blue-300 pt-1">
                <span className="text-blue-800">Total:</span>
                <span className="text-blue-800">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {step === 1 && (
            <div>
              <h3 className="font-semibold text-slate-800 mb-4">Select Payment Method</h3>
              <div className="space-y-3">
                {PAYMENT_METHODS.filter(m => m.available).map((method) => {
                  const IconComponent = getMethodIcon(method.type);
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`w-full p-4 border rounded-lg text-left transition-colors ${
                        selectedMethod === method.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-6 h-6 text-slate-600" />
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-800">{method.name}</h4>
                          <p className="text-sm text-slate-600">
                            {method.fees > 0 ? `${(method.fees * 100).toFixed(1)}% processing fee` : 'No additional fees'}
                          </p>
                        </div>
                        {selectedMethod === method.id && (
                          <Check className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setStep(2)}
                className="w-full mt-6 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="font-semibold text-slate-800 mb-4">Payment Details</h3>
              
              {selectedMethod === 'card' && (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Cardholder Name"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {(selectedMethod === 'jazzcash' || selectedMethod === 'easypaisa') && (
                <div className="space-y-4">
                  <input
                    type="tel"
                    placeholder="Mobile Number (03XXXXXXXXX)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="password"
                    placeholder="Mobile Account PIN"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {selectedMethod === 'bank_transfer' && (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-yellow-800 mb-2">Bank Transfer Details</h4>
                  <div className="text-sm text-yellow-700 space-y-1">
                    <p><strong>Bank:</strong> Meezan Bank</p>
                    <p><strong>Account:</strong> 01234567890123</p>
                    <p><strong>Title:</strong> AI Business Solutions</p>
                    <p><strong>Amount:</strong> ${total.toFixed(2)}</p>
                  </div>
                </div>
              )}

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                </button>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="mt-6 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700">
                Your payment is secured with 256-bit SSL encryption
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;