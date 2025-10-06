import { CurrencyManager, SUPPORTED_CURRENCIES } from './currency';
import { supabase, isDemoMode } from './supabase';
import { database } from './database';

export interface TierLimits {
  contentGenerations: number;
  invoices: number;
  campaigns: number;
  tasks: number;
  aiQueries: number;
  pdfExports: number;
  storage: number;
}

export interface UserTier {
  name: string;
  price: number;
  limits: TierLimits;
  features: string[];
}

export const TIERS: Record<string, UserTier> = {
  free: {
    name: 'Free',
    price: 0,
    limits: {
      contentGenerations: 5,
      invoices: 2,
      campaigns: 1,
      tasks: 10,
      aiQueries: 20,
      pdfExports: 2,
      storage: 50
    },
    features: [
      'Basic AI content generation',
      'Simple invoice creation',
      'Task management',
      'Email support'
    ]
  },
  starter: {
    name: 'Starter',
    price: 2,
    limits: {
      contentGenerations: 50,
      invoices: 25,
      campaigns: 10,
      tasks: 100,
      aiQueries: 200,
      pdfExports: 25,
      storage: 500
    },
    features: [
      'Enhanced AI content generation',
      'Professional invoice templates',
      'Campaign analytics',
      'Priority support',
      'Basic team features'
    ]
  },
  professional: {
    name: 'Professional',
    price: 5,
    limits: {
      contentGenerations: -1,
      invoices: -1,
      campaigns: -1,
      tasks: -1,
      aiQueries: -1,
      pdfExports: -1,
      storage: -1
    },
    features: [
      'Unlimited everything',
      'Advanced analytics',
      'Team collaboration',
      'Custom branding',
      'Portfolio builder',
      'CRM & Lead management',
      '24/7 support'
    ]
  }
};

export class TierManager {
  static async getCurrentTier(): Promise<string> {
    if (isDemoMode || !supabase) {
      const demoUser = localStorage.getItem('demoUser');
      if (demoUser) {
        const user = JSON.parse(demoUser);
        return user.tier || 'free';
      }
      return 'free';
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 'free';

      const { data: profile } = await supabase
        .from('users')
        .select('tier, currency, settings')
        .eq('id', user.id)
        .maybeSingle();

      if (profile) {
        if (profile.currency) {
          CurrencyManager.setUserCurrency(profile.currency);
        }
        return profile.tier || 'free';
      }
    } catch (error) {
      console.error('Error fetching tier:', error);
    }
    return 'free';
  }

  static async setTier(tier: string) {
    if (isDemoMode || !supabase) {
      const demoUser = JSON.parse(localStorage.getItem('demoUser') || '{}');
      demoUser.tier = tier;
      localStorage.setItem('demoUser', JSON.stringify(demoUser));
      console.log('Demo tier updated to:', tier);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      await supabase
        .from('users')
        .update({ tier, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);

      const { data: existingSub } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingSub) {
        await supabase
          .from('subscriptions')
          .update({
            tier,
            status: 'active',
            current_period_start: startDate.toISOString(),
            current_period_end: endDate.toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('subscriptions')
          .insert({
            user_id: user.id,
            tier,
            status: 'active',
            current_period_start: startDate.toISOString(),
            current_period_end: endDate.toISOString()
          });
      }

      console.log('Tier updated to:', tier);
    } catch (error) {
      console.error('Error updating tier:', error);
      throw error;
    }
  }

  static async getUsage(): Promise<Record<string, number>> {
    if (isDemoMode || !supabase) {
      const usage = localStorage.getItem('demoUsage');
      return usage ? JSON.parse(usage) : {
        contentGenerations: 0,
        invoices: 0,
        campaigns: 0,
        tasks: 0,
        aiQueries: 0,
        pdfExports: 0
      };
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return this.getEmptyUsage();

      const now = new Date();
      const month = now.toISOString().substring(0, 7);

      const { data: usage } = await supabase
        .from('usage_tracking')
        .select('feature_type, count')
        .eq('user_id', user.id)
        .eq('month', month);

      const usageMap: Record<string, number> = this.getEmptyUsage();

      if (usage) {
        usage.forEach((item: any) => {
          usageMap[item.feature_type] = item.count;
        });
      }

      return usageMap;
    } catch (error) {
      console.error('Error fetching usage:', error);
      return this.getEmptyUsage();
    }
  }

  static async updateUsage(type: keyof TierLimits, increment: number = 1) {
    if (isDemoMode || !supabase) {
      const usage = await this.getUsage();
      usage[type] = (usage[type] || 0) + increment;
      localStorage.setItem('demoUsage', JSON.stringify(usage));
      console.log(`Demo usage updated: ${type} = ${usage[type]}`);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const now = new Date();
      const month = now.toISOString().substring(0, 7);

      const { data: existing } = await supabase
        .from('usage_tracking')
        .select('id, count')
        .eq('user_id', user.id)
        .eq('feature_type', type)
        .eq('month', month)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('usage_tracking')
          .update({
            count: existing.count + increment,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('usage_tracking')
          .insert({
            user_id: user.id,
            feature_type: type,
            count: increment,
            month
          });
      }

      console.log(`Usage updated: ${type} +${increment}`);
    } catch (error) {
      console.error('Error updating usage:', error);
    }
  }

  static async canUseFeature(type: keyof TierLimits): Promise<boolean> {
    const currentTier = await this.getCurrentTier();
    const tierLimits = TIERS[currentTier].limits;
    const usage = await this.getUsage();

    if (tierLimits[type] === -1) return true;

    const canUse = (usage[type] || 0) < tierLimits[type];
    console.log(`Feature check: ${type} - ${canUse ? 'ALLOWED' : 'BLOCKED'} (${usage[type] || 0}/${tierLimits[type]})`);
    return canUse;
  }

  static async getRemainingUsage(type: keyof TierLimits): Promise<number> {
    const currentTier = await this.getCurrentTier();
    const tierLimits = TIERS[currentTier].limits;
    const usage = await this.getUsage();

    if (tierLimits[type] === -1) return -1;
    return Math.max(0, tierLimits[type] - (usage[type] || 0));
  }

  static async getSubscription() {
    if (isDemoMode || !supabase) {
      return {
        tier: 'free',
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return this.getDefaultSubscription();

      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      return subscription || this.getDefaultSubscription();
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return this.getDefaultSubscription();
    }
  }

  static async isSubscriptionActive(): Promise<boolean> {
    const subscription = await this.getSubscription();
    const now = new Date();
    const endDate = new Date(subscription.current_period_end);

    return subscription.status === 'active' && endDate > now;
  }

  static async getDaysUntilRenewal(): Promise<number> {
    const subscription = await this.getSubscription();
    const now = new Date();
    const endDate = new Date(subscription.current_period_end);
    const diffTime = endDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private static getEmptyUsage(): Record<string, number> {
    return {
      contentGenerations: 0,
      invoices: 0,
      campaigns: 0,
      tasks: 0,
      aiQueries: 0,
      pdfExports: 0
    };
  }

  private static getDefaultSubscription() {
    return {
      tier: 'free',
      status: 'active',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
  }
}
