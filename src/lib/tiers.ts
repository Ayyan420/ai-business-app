// Updated tier management system with new pricing
export interface TierLimits {
  contentGenerations: number;
  invoices: number;
  campaigns: number;
  tasks: number;
  aiQueries: number;
  pdfExports: number;
  storage: number; // in MB
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
      storage: 50 // 50MB
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
    price: 2, // $2 USD
    limits: {
      contentGenerations: 50,
      invoices: 25,
      campaigns: 10,
      tasks: 100,
      aiQueries: 200,
      pdfExports: 25,
      storage: 500 // 500MB
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
    price: 5, // $5 USD
    limits: {
      contentGenerations: -1, // Unlimited
      invoices: -1,
      campaigns: -1,
      tasks: -1,
      aiQueries: -1,
      pdfExports: -1,
      storage: -1 // Unlimited
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
  private static STORAGE_KEY = 'userTierUsage';
  private static SUBSCRIPTION_KEY = 'userSubscription';

  // Async: check DB, fallback to localStorage
  static async getCurrentTier(): Promise<string> {
    try {
      const { data: profile } = await import('./database')
        .then(db => db.database.getCurrentUser());

      if (profile?.tier) {
        localStorage.setItem('userTier', profile.tier);
        return profile.tier;
      }
    } catch (error) {
      console.log('Database not available, using localStorage');
    }
    return localStorage.getItem('userTier') || 'free';
  }

  // ✅ Sync version for immediate usage
  static getCachedTier(): string {
    return localStorage.getItem('userTier') || 'free';
  }

  static async setTier(tier: string) {
    localStorage.setItem('userTier', tier);
    
    // Update subscription info
    const subscription = {
      tier,
      status: 'active',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    };
    localStorage.setItem(this.SUBSCRIPTION_KEY, JSON.stringify(subscription));
    
    try {
      const { auth } = await import('./supabase');
      const { data: { user } } = await auth.getUser();
      if (user) {
        const { database } = await import('./database');
        await database.updateUserProfile(user.id, { tier });
        await database.updateSubscription(subscription);
      }
    } catch (error) {
      console.log('Database update failed, tier saved locally');
    }
    console.log('🎯 Tier updated to:', tier);
  }

  static getUsage(): Record<string, number> {
    const usage = localStorage.getItem(this.STORAGE_KEY);
    return usage ? JSON.parse(usage) : {
      contentGenerations: 0,
      invoices: 0,
      campaigns: 0,
      tasks: 0,
      aiQueries: 0,
      pdfExports: 0
    };
  }

  static updateUsage(type: keyof TierLimits, increment: number = 1) {
    const usage = this.getUsage();
    usage[type] = (usage[type] || 0) + increment;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usage));
    console.log(`📊 Usage updated: ${type} = ${usage[type]}`);
  }

  static canUseFeature(type: keyof TierLimits): boolean {
    const currentTier = this.getCachedTier(); // ✅ fixed
    const tierLimits = TIERS[currentTier].limits;
    const usage = this.getUsage();

    if (tierLimits[type] === -1) return true;
    const canUse = (usage[type] || 0) < tierLimits[type];
    console.log(`🔒 Feature check: ${type} - ${canUse ? 'ALLOWED' : 'BLOCKED'} (${usage[type] || 0}/${tierLimits[type]})`);
    return canUse;
  }

  static getRemainingUsage(type: keyof TierLimits): number {
    const currentTier = this.getCachedTier(); // ✅ fixed
    const tierLimits = TIERS[currentTier].limits;
    const usage = this.getUsage();

    if (tierLimits[type] === -1) return -1;
    return Math.max(0, tierLimits[type] - (usage[type] || 0));
  }

  static resetMonthlyUsage() {
    localStorage.removeItem(this.STORAGE_KEY);
    console.log('🔄 Monthly usage reset');
  }

  static getSubscription() {
    const subscription = localStorage.getItem(this.SUBSCRIPTION_KEY);
    return subscription ? JSON.parse(subscription) : {
      tier: 'free',
      status: 'active',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  static isSubscriptionActive(): boolean {
    const subscription = this.getSubscription();
    const now = new Date();
    const endDate = new Date(subscription.current_period_end);
    
    return subscription.status === 'active' && endDate > now;
  }

  static getDaysUntilRenewal(): number {
    const subscription = this.getSubscription();
    const now = new Date();
    const endDate = new Date(subscription.current_period_end);
    const diffTime = endDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
