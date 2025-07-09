// Tier management system for free and paid plans
export interface TierLimits {
  contentGenerations: number;
  invoices: number;
  campaigns: number;
  tasks: number;
  aiQueries: number;
  pdfExports: number;
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
      contentGenerations: 10,
      invoices: 5,
      campaigns: 3,
      tasks: 20,
      aiQueries: 50,
      pdfExports: 5
    },
    features: [
      'Basic AI content generation',
      'Simple invoice creation',
      'Task management',
      'Email support'
    ]
  },
  pro: {
    name: 'Professional',
    price: 9.99, // Very affordable for Pakistan market
    limits: {
      contentGenerations: 100,
      invoices: 50,
      campaigns: 25,
      tasks: 200,
      aiQueries: 500,
      pdfExports: 50
    },
    features: [
      'Advanced AI content generation',
      'Professional invoice templates',
      'Campaign analytics',
      'Priority support',
      'Custom branding'
    ]
  },
  business: {
    name: 'Business',
    price: 19.99,
    limits: {
      contentGenerations: -1, // Unlimited
      invoices: -1,
      campaigns: -1,
      tasks: -1,
      aiQueries: -1,
      pdfExports: -1
    },
    features: [
      'Unlimited everything',
      'Advanced analytics',
      'Team collaboration',
      'API access',
      'Custom integrations',
      '24/7 phone support'
    ]
  }
};

export class TierManager {
  private static STORAGE_KEY = 'userTierUsage';

  static getCurrentTier(): string {
    return localStorage.getItem('userTier') || 'free';
  }

  static setTier(tier: string) {
    localStorage.setItem('userTier', tier);
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
  }

  static canUseFeature(type: keyof TierLimits): boolean {
    const currentTier = this.getCurrentTier();
    const tierLimits = TIERS[currentTier].limits;
    const usage = this.getUsage();

    // -1 means unlimited
    if (tierLimits[type] === -1) return true;
    
    return (usage[type] || 0) < tierLimits[type];
  }

  static getRemainingUsage(type: keyof TierLimits): number {
    const currentTier = this.getCurrentTier();
    const tierLimits = TIERS[currentTier].limits;
    const usage = this.getUsage();

    if (tierLimits[type] === -1) return -1; // Unlimited
    
    return Math.max(0, tierLimits[type] - (usage[type] || 0));
  }

  static resetMonthlyUsage() {
    // This would typically be called by a cron job or when a new month starts
    localStorage.removeItem(this.STORAGE_KEY);
  }
}