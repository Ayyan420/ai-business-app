import { supabase, isDemoMode } from './supabase';
import { TierManager } from './tiers';

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'mobile' | 'bank';
  available: boolean;
  fees: number;
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'jazzcash',
    name: 'JazzCash',
    type: 'mobile',
    available: true,
    fees: 0.02
  },
  {
    id: 'easypaisa',
    name: 'EasyPaisa',
    type: 'mobile',
    available: true,
    fees: 0.02
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    type: 'bank',
    available: true,
    fees: 0.01
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    type: 'card',
    available: true,
    fees: 0.035
  }
];

export class PaymentProcessor {
  static async processPayment(
    amount: number,
    currency: string,
    method: string,
    userDetails: any,
    tierName: string
  ): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    console.log('Processing payment:', { amount, currency, method, tierName });

    try {
      if (!amount || amount <= 0) {
        throw new Error('Invalid payment amount');
      }

      if (!userDetails || !userDetails.id) {
        throw new Error('User information is required');
      }

      if (!tierName || !['starter', 'professional'].includes(tierName)) {
        throw new Error('Invalid subscription tier');
      }

      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.9) {
            reject(new Error('Payment gateway temporarily unavailable'));
          } else {
            resolve(true);
          }
        }, 2000);
      });

      const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const paymentRecord = {
        user_id: userDetails.id,
        amount,
        currency,
        status: 'completed',
        payment_method: method,
        transaction_id: transactionId,
        tier: tierName,
        billing_period_start: new Date().toISOString(),
        billing_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString()
      };

      if (isDemoMode || !supabase) {
        localStorage.setItem('lastPayment', JSON.stringify(paymentRecord));
        const demoUser = JSON.parse(localStorage.getItem('demoUser') || '{}');
        demoUser.tier = tierName;
        localStorage.setItem('demoUser', JSON.stringify(demoUser));
      } else {
        const { error: paymentError } = await supabase
          .from('payments')
          .insert(paymentRecord);

        if (paymentError) {
          console.error('Failed to save payment record:', paymentError);
          throw new Error('Failed to save payment record');
        }

        await TierManager.setTier(tierName);
      }

      console.log('Payment processed successfully:', transactionId);
      return {
        success: true,
        transactionId
      };
    } catch (error) {
      console.error('Payment processing failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment processing failed. Please try again.'
      };
    }
  }

  static async getPaymentHistory(userId: string) {
    if (isDemoMode || !supabase) {
      const lastPayment = localStorage.getItem('lastPayment');
      return lastPayment ? [JSON.parse(lastPayment)] : [];
    }

    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching payment history:', error);
      return [];
    }
  }

  static async initializeJazzCash(amount: number, orderId: string) {
    return {
      paymentUrl: `https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/?${new URLSearchParams({
        pp_Amount: (amount * 100).toString(),
        pp_BillReference: orderId,
        pp_Description: 'AI Business Assistant Subscription',
        pp_Language: 'EN',
        pp_MerchantID: 'MC12345',
        pp_Password: 'password',
        pp_ReturnURL: `${window.location.origin}/payment/success`,
        pp_ver: '1.1',
        pp_TxnCurrency: 'PKR',
        pp_TxnDateTime: new Date().toISOString().replace(/[-:]/g, '').split('.')[0],
        pp_TxnExpiryDateTime: new Date(Date.now() + 30 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0],
        pp_TxnRefNo: orderId,
        pp_TxnType: 'MWALLET'
      }).toString()}`
    };
  }

  static async initializeEasyPaisa(amount: number, orderId: string) {
    return {
      paymentUrl: `https://easypaisa.com.pk/easypay/Index.jsf?${new URLSearchParams({
        amount: amount.toString(),
        orderRefNum: orderId,
        merchantId: 'YOUR_MERCHANT_ID',
        returnUrl: `${window.location.origin}/payment/success`
      }).toString()}`
    };
  }

  static calculateTotal(baseAmount: number, method: string): number {
    const paymentMethod = PAYMENT_METHODS.find(m => m.id === method);
    const fees = paymentMethod ? baseAmount * paymentMethod.fees : 0;
    return baseAmount + fees;
  }
}

export const handlePaymentWebhook = async (payload: any) => {
  console.log('Payment webhook received:', payload);
  return { success: true };
};
