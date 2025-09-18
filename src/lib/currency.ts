// Currency management system
export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Exchange rate to USD
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyInfo> = {
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    rate: 1.0
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    rate: 0.85
  },
  GBP: {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    rate: 0.73
  },
  CAD: {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'C$',
    rate: 1.35
  },
  AUD: {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    rate: 1.45
  },
  JPY: {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    rate: 110.0
  },
  CHF: {
    code: 'CHF',
    name: 'Swiss Franc',
    symbol: 'CHF',
    rate: 0.92
  },
  CNY: {
    code: 'CNY',
    name: 'Chinese Yuan',
    symbol: '¥',
    rate: 7.2
  },
  INR: {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    rate: 83.0
  },
  PKR: {
    code: 'PKR',
    name: 'Pakistani Rupee',
    symbol: '₨',
    rate: 280.0
  },
  BRL: {
    code: 'BRL',
    name: 'Brazilian Real',
    symbol: 'R$',
    rate: 5.2
  },
  MXN: {
    code: 'MXN',
    name: 'Mexican Peso',
    symbol: '$',
    rate: 18.0
  },
  ZAR: {
    code: 'ZAR',
    name: 'South African Rand',
    symbol: 'R',
    rate: 18.5
  },
  NGN: {
    code: 'NGN',
    name: 'Nigerian Naira',
    symbol: '₦',
    rate: 460.0
  },
  EGP: {
    code: 'EGP',
    name: 'Egyptian Pound',
    symbol: 'E£',
    rate: 31.0
  }
};

export class CurrencyManager {
  private static STORAGE_KEY = 'userCurrency';
  private static RATES_CACHE_KEY = 'currencyRatesCache';
  private static CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  static getUserCurrency(): string {
    return localStorage.getItem(this.STORAGE_KEY) || 'USD';
  }

  static setUserCurrency(currency: string) {
    if (SUPPORTED_CURRENCIES[currency]) {
      localStorage.setItem(this.STORAGE_KEY, currency);
      console.log('💱 User currency updated to:', currency);
    }
  }

  static getCurrencyInfo(code: string): CurrencyInfo {
    return SUPPORTED_CURRENCIES[code] || SUPPORTED_CURRENCIES.USD;
  }

  static formatAmount(amount: number, currencyCode?: string): string {
    const currency = currencyCode || this.getUserCurrency();
    const currencyInfo = this.getCurrencyInfo(currency);
    
    // Convert from USD to display currency
    const convertedAmount = amount * currencyInfo.rate;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(convertedAmount);
  }

  static convertToUSD(amount: number, fromCurrency: string): number {
    const currencyInfo = this.getCurrencyInfo(fromCurrency);
    return amount / currencyInfo.rate;
  }

  static convertFromUSD(amount: number, toCurrency: string): number {
    const currencyInfo = this.getCurrencyInfo(toCurrency);
    return amount * currencyInfo.rate;
  }

  static getDisplayAmount(usdAmount: number, displayCurrency?: string): number {
    const currency = displayCurrency || this.getUserCurrency();
    return this.convertFromUSD(usdAmount, currency);
  }

  // Update exchange rates (in a real app, this would fetch from an API)
  static async updateExchangeRates(): Promise<void> {
    try {
      // In a real implementation, you would fetch from a currency API
      // For now, we'll use static rates
      const cacheData = {
        rates: SUPPORTED_CURRENCIES,
        timestamp: Date.now()
      };
      localStorage.setItem(this.RATES_CACHE_KEY, JSON.stringify(cacheData));
      console.log('💱 Exchange rates updated');
    } catch (error) {
      console.error('Failed to update exchange rates:', error);
    }
  }

  static shouldUpdateRates(): boolean {
    const cached = localStorage.getItem(this.RATES_CACHE_KEY);
    if (!cached) return true;
    
    try {
      const { timestamp } = JSON.parse(cached);
      return Date.now() - timestamp > this.CACHE_DURATION;
    } catch {
      return true;
    }
  }

  static getAllCurrencies(): CurrencyInfo[] {
    return Object.values(SUPPORTED_CURRENCIES);
  }
}

// Initialize currency rates on app load
if (CurrencyManager.shouldUpdateRates()) {
  CurrencyManager.updateExchangeRates();
}