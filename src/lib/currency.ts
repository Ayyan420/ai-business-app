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
  AED: {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'د.إ',
    rate: 3.67
  },
  AFN: {
    code: 'AFN',
    name: 'Afghan Afghani',
    symbol: '؋',
    rate: 70.0
  },
  ALL: {
    code: 'ALL',
    name: 'Albanian Lek',
    symbol: 'L',
    rate: 92.0
  },
  AMD: {
    code: 'AMD',
    name: 'Armenian Dram',
    symbol: '֏',
    rate: 385.0
  },
  ANG: {
    code: 'ANG',
    name: 'Netherlands Antillean Guilder',
    symbol: 'ƒ',
    rate: 1.8
  },
  AOA: {
    code: 'AOA',
    name: 'Angolan Kwanza',
    symbol: 'Kz',
    rate: 825.0
  },
  ARS: {
    code: 'ARS',
    name: 'Argentine Peso',
    symbol: '$',
    rate: 350.0
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
  AWG: {
    code: 'AWG',
    name: 'Aruban Florin',
    symbol: 'ƒ',
    rate: 1.8
  },
  AZN: {
    code: 'AZN',
    name: 'Azerbaijani Manat',
    symbol: '₼',
    rate: 1.7
  },
  BAM: {
    code: 'BAM',
    name: 'Bosnia-Herzegovina Convertible Mark',
    symbol: 'KM',
    rate: 1.66
  },
  BBD: {
    code: 'BBD',
    name: 'Barbadian Dollar',
    symbol: '$',
    rate: 2.0
  },
  BDT: {
    code: 'BDT',
    name: 'Bangladeshi Taka',
    symbol: '৳',
    rate: 110.0
  },
  BGN: {
    code: 'BGN',
    name: 'Bulgarian Lev',
    symbol: 'лв',
    rate: 1.66
  },
  BHD: {
    code: 'BHD',
    name: 'Bahraini Dinar',
    symbol: '.د.ب',
    rate: 0.377
  },
  BIF: {
    code: 'BIF',
    name: 'Burundian Franc',
    symbol: 'FBu',
    rate: 2850.0
  },
  BMD: {
    code: 'BMD',
    name: 'Bermudan Dollar',
    symbol: '$',
    rate: 1.0
  },
  BND: {
    code: 'BND',
    name: 'Brunei Dollar',
    symbol: '$',
    rate: 1.35
  },
  BOB: {
    code: 'BOB',
    name: 'Bolivian Boliviano',
    symbol: '$b',
    rate: 6.9
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
  BSD: {
    code: 'BSD',
    name: 'Bahamian Dollar',
    symbol: '$',
    rate: 1.0
  },
  BTN: {
    code: 'BTN',
    name: 'Bhutanese Ngultrum',
    symbol: 'Nu.',
    rate: 83.0
  },
  BWP: {
    code: 'BWP',
    name: 'Botswanan Pula',
    symbol: 'P',
    rate: 13.5
  },
  BYN: {
    code: 'BYN',
    name: 'Belarusian Ruble',
    symbol: 'Br',
    rate: 3.2
  },
  BZD: {
    code: 'BZD',
    name: 'Belize Dollar',
    symbol: 'BZ$',
    rate: 2.0
  },
  MXN: {
    code: 'MXN',
    name: 'Mexican Peso',
    symbol: '$',
    rate: 18.0
  },
  CDF: {
    code: 'CDF',
    name: 'Congolese Franc',
    symbol: 'FC',
    rate: 2700.0
  },
  ZAR: {
    code: 'ZAR',
    name: 'South African Rand',
    symbol: 'R',
    rate: 18.5
  },
  CLP: {
    code: 'CLP',
    name: 'Chilean Peso',
    symbol: '$',
    rate: 900.0
  },
  NGN: {
    code: 'NGN',
    name: 'Nigerian Naira',
    symbol: '₦',
    rate: 460.0
  },
  COP: {
    code: 'COP',
    name: 'Colombian Peso',
    symbol: '$',
    rate: 4200.0
  },
  CRC: {
    code: 'CRC',
    name: 'Costa Rican Colón',
    symbol: '₡',
    rate: 520.0
  },
  CUP: {
    code: 'CUP',
    name: 'Cuban Peso',
    symbol: '₱',
    rate: 24.0
  },
  CVE: {
    code: 'CVE',
    name: 'Cape Verdean Escudo',
    symbol: '$',
    rate: 93.0
  },
  CZK: {
    code: 'CZK',
    name: 'Czech Republic Koruna',
    symbol: 'Kč',
    rate: 22.0
  },
  DJF: {
    code: 'DJF',
    name: 'Djiboutian Franc',
    symbol: 'Fdj',
    rate: 177.0
  },
  DKK: {
    code: 'DKK',
    name: 'Danish Krone',
    symbol: 'kr',
    rate: 6.3
  },
  DOP: {
    code: 'DOP',
    name: 'Dominican Peso',
    symbol: 'RD$',
    rate: 58.0
  },
  DZD: {
    code: 'DZD',
    name: 'Algerian Dinar',
    symbol: 'دج',
    rate: 135.0
  },
  EGP: {
    code: 'EGP',
    name: 'Egyptian Pound',
    symbol: 'E£',
    rate: 31.0
  }
  ERN: {
    code: 'ERN',
    name: 'Eritrean Nakfa',
    symbol: 'Nfk',
    rate: 15.0
  },
  ETB: {
    code: 'ETB',
    name: 'Ethiopian Birr',
    symbol: 'Br',
    rate: 55.0
  },
  FJD: {
    code: 'FJD',
    name: 'Fijian Dollar',
    symbol: '$',
    rate: 2.2
  },
  FKP: {
    code: 'FKP',
    name: 'Falkland Islands Pound',
    symbol: '£',
    rate: 0.73
  },
  GEL: {
    code: 'GEL',
    name: 'Georgian Lari',
    symbol: '₾',
    rate: 2.7
  },
  GGP: {
    code: 'GGP',
    name: 'Guernsey Pound',
    symbol: '£',
    rate: 0.73
  },
  GHS: {
    code: 'GHS',
    name: 'Ghanaian Cedi',
    symbol: '¢',
    rate: 12.0
  },
  GIP: {
    code: 'GIP',
    name: 'Gibraltar Pound',
    symbol: '£',
    rate: 0.73
  },
  GMD: {
    code: 'GMD',
    name: 'Gambian Dalasi',
    symbol: 'D',
    rate: 67.0
  },
  GNF: {
    code: 'GNF',
    name: 'Guinean Franc',
    symbol: 'FG',
    rate: 8600.0
  },
  GTQ: {
    code: 'GTQ',
    name: 'Guatemalan Quetzal',
    symbol: 'Q',
    rate: 7.8
  },
  GYD: {
    code: 'GYD',
    name: 'Guyanaese Dollar',
    symbol: '$',
    rate: 209.0
  },
  HKD: {
    code: 'HKD',
    name: 'Hong Kong Dollar',
    symbol: 'HK$',
    rate: 7.8
  },
  HNL: {
    code: 'HNL',
    name: 'Honduran Lempira',
    symbol: 'L',
    rate: 24.7
  },
  HRK: {
    code: 'HRK',
    name: 'Croatian Kuna',
    symbol: 'kn',
    rate: 6.8
  },
  IQD: {
    code: 'IQD',
    name: 'Iraqi Dinar',
    symbol: 'ع.د',
    rate: 1310.0
  },
  IRR: {
    code: 'IRR',
    name: 'Iranian Rial',
    symbol: '﷼',
    rate: 42000.0
  },
  ISK: {
    code: 'ISK',
    name: 'Icelandic Króna',
    symbol: 'kr',
    rate: 138.0
  },
  JEP: {
    code: 'JEP',
    name: 'Jersey Pound',
    symbol: '£',
    rate: 0.73
  },
  JMD: {
    code: 'JMD',
    name: 'Jamaican Dollar',
    symbol: 'J$',
    rate: 155.0
  },
  HTG: {
    code: 'HTG',
    name: 'Haitian Gourde',
    symbol: 'G',
    rate: 132.0
  },
  JOD: {
    code: 'JOD',
    name: 'Jordanian Dinar',
    symbol: 'JD',
    rate: 0.71
  },
  KES: {
    code: 'KES',
    name: 'Kenyan Shilling',
    symbol: 'KSh',
    rate: 145.0
  },
  KGS: {
    code: 'KGS',
    name: 'Kyrgystani Som',
    symbol: 'лв',
    rate: 89.0
  },
  KHR: {
    code: 'KHR',
    name: 'Cambodian Riel',
    symbol: '៛',
    rate: 4100.0
  },
  KMF: {
    code: 'KMF',
    name: 'Comorian Franc',
    symbol: 'CF',
    rate: 417.0
  },
  KPW: {
    code: 'KPW',
    name: 'North Korean Won',
    symbol: '₩',
    rate: 900.0
  },
  KRW: {
    code: 'KRW',
    name: 'South Korean Won',
    symbol: '₩',
    rate: 1300.0
  },
  KWD: {
    code: 'KWD',
    name: 'Kuwaiti Dinar',
    symbol: 'KD',
    rate: 0.31
  },
  KYD: {
    code: 'KYD',
    name: 'Cayman Islands Dollar',
    symbol: '$',
    rate: 0.83
  },
  KZT: {
    code: 'KZT',
    name: 'Kazakhstani Tenge',
    symbol: '₸',
    rate: 450.0
  },
  LAK: {
    code: 'LAK',
    name: 'Laotian Kip',
    symbol: '₭',
    rate: 20500.0
  },
  LBP: {
    code: 'LBP',
    name: 'Lebanese Pound',
    symbol: '£',
    rate: 15000.0
  },
  LKR: {
    code: 'LKR',
    name: 'Sri Lankan Rupee',
    symbol: '₨',
    rate: 325.0
  },
  LRD: {
    code: 'LRD',
    name: 'Liberian Dollar',
    symbol: '$',
    rate: 185.0
  },
  LSL: {
    code: 'LSL',
    name: 'Lesotho Loti',
    symbol: 'M',
    rate: 18.5
  },
  LYD: {
    code: 'LYD',
    name: 'Libyan Dinar',
    symbol: 'LD',
    rate: 4.8
  },
  MAD: {
    code: 'MAD',
    name: 'Moroccan Dirham',
    symbol: 'MAD',
    rate: 10.2
  },
  MDL: {
    code: 'MDL',
    name: 'Moldovan Leu',
    symbol: 'L',
    rate: 17.8
  },
  MGA: {
    code: 'MGA',
    name: 'Malagasy Ariary',
    symbol: 'Ar',
    rate: 4500.0
  },
  MKD: {
    code: 'MKD',
    name: 'Macedonian Denar',
    symbol: 'ден',
    rate: 52.0
  },
  MMK: {
    code: 'MMK',
    name: 'Myanma Kyat',
    symbol: 'K',
    rate: 2100.0
  },
  MNT: {
    code: 'MNT',
    name: 'Mongolian Tugrik',
    symbol: '₮',
    rate: 3400.0
  },
  MOP: {
    code: 'MOP',
    name: 'Macanese Pataca',
    symbol: 'MOP$',
    rate: 8.0
  },
  MRU: {
    code: 'MRU',
    name: 'Mauritanian Ouguiya',
    symbol: 'UM',
    rate: 37.0
  },
  MUR: {
    code: 'MUR',
    name: 'Mauritian Rupee',
    symbol: '₨',
    rate: 45.0
  },
  MVR: {
    code: 'MVR',
    name: 'Maldivian Rufiyaa',
    symbol: 'Rf',
    rate: 15.4
  },
  MWK: {
    code: 'MWK',
    name: 'Malawian Kwacha',
    symbol: 'MK',
    rate: 1700.0
  },
  HUF: {
    code: 'HUF',
    name: 'Hungarian Forint',
    symbol: 'Ft',
    rate: 350.0
  },
  MYR: {
    code: 'MYR',
    name: 'Malaysian Ringgit',
    symbol: 'RM',
    rate: 4.7
  },
  MZN: {
    code: 'MZN',
    name: 'Mozambican Metical',
    symbol: 'MT',
    rate: 64.0
  },
  NAD: {
    code: 'NAD',
    name: 'Namibian Dollar',
    symbol: '$',
    rate: 18.5
  },
  IDR: {
    code: 'IDR',
    name: 'Indonesian Rupiah',
    symbol: 'Rp',
    rate: 15300.0
  },
  NIO: {
    code: 'NIO',
    name: 'Nicaraguan Córdoba',
    symbol: 'C$',
    rate: 36.7
  },
  NOK: {
    code: 'NOK',
    name: 'Norwegian Krone',
    symbol: 'kr',
    rate: 10.8
  },
  NPR: {
    code: 'NPR',
    name: 'Nepalese Rupee',
    symbol: '₨',
    rate: 133.0
  },
  NZD: {
    code: 'NZD',
    name: 'New Zealand Dollar',
    symbol: '$',
    rate: 1.6
  },
  OMR: {
    code: 'OMR',
    name: 'Omani Rial',
    symbol: '﷼',
    rate: 0.385
  },
  PAB: {
    code: 'PAB',
    name: 'Panamanian Balboa',
    symbol: 'B/.',
    rate: 1.0
  },
  PEN: {
    code: 'PEN',
    name: 'Peruvian Nuevo Sol',
    symbol: 'S/.',
    rate: 3.7
  },
  PGK: {
    code: 'PGK',
    name: 'Papua New Guinean Kina',
    symbol: 'K',
    rate: 3.9
  },
  PHP: {
    code: 'PHP',
    name: 'Philippine Peso',
    symbol: '₱',
    rate: 56.0
  },
  ILS: {
    code: 'ILS',
    name: 'Israeli New Sheqel',
    symbol: '₪',
    rate: 3.7
  },
  PLN: {
    code: 'PLN',
    name: 'Polish Zloty',
    symbol: 'zł',
    rate: 4.0
  },
  PYG: {
    code: 'PYG',
    name: 'Paraguayan Guarani',
    symbol: 'Gs',
    rate: 7300.0
  },
  QAR: {
    code: 'QAR',
    name: 'Qatari Rial',
    symbol: '﷼',
    rate: 3.64
  },
  RON: {
    code: 'RON',
    name: 'Romanian Leu',
    symbol: 'lei',
    rate: 4.6
  },
  RSD: {
    code: 'RSD',
    name: 'Serbian Dinar',
    symbol: 'Дин.',
    rate: 105.0
  },
  RUB: {
    code: 'RUB',
    name: 'Russian Ruble',
    symbol: '₽',
    rate: 90.0
  },
  RWF: {
    code: 'RWF',
    name: 'Rwandan Franc',
    symbol: 'R₣',
    rate: 1300.0
  },
  SAR: {
    code: 'SAR',
    name: 'Saudi Riyal',
    symbol: '﷼',
    rate: 3.75
  },
  SBD: {
    code: 'SBD',
    name: 'Solomon Islands Dollar',
    symbol: '$',
    rate: 8.4
  },
  SCR: {
    code: 'SCR',
    name: 'Seychellois Rupee',
    symbol: '₨',
    rate: 13.5
  },
  SDG: {
    code: 'SDG',
    name: 'Sudanese Pound',
    symbol: 'ج.س.',
    rate: 600.0
  },
  SEK: {
    code: 'SEK',
    name: 'Swedish Krona',
    symbol: 'kr',
    rate: 10.4
  },
  SGD: {
    code: 'SGD',
    name: 'Singapore Dollar',
    symbol: '$',
    rate: 1.35
  },
  SHP: {
    code: 'SHP',
    name: 'Saint Helena Pound',
    symbol: '£',
    rate: 0.73
  },
  SLE: {
    code: 'SLE',
    name: 'Sierra Leonean Leone',
    symbol: 'Le',
    rate: 22000.0
  },
  SOS: {
    code: 'SOS',
    name: 'Somali Shilling',
    symbol: 'S',
    rate: 570.0
  },
  SRD: {
    code: 'SRD',
    name: 'Surinamese Dollar',
    symbol: '$',
    rate: 36.0
  },
  STN: {
    code: 'STN',
    name: 'São Tomé and Príncipe Dobra',
    symbol: 'Db',
    rate: 22.0
  },
  SYP: {
    code: 'SYP',
    name: 'Syrian Pound',
    symbol: '£',
    rate: 2500.0
  },
  SZL: {
    code: 'SZL',
    name: 'Swazi Lilangeni',
    symbol: 'E',
    rate: 18.5
  },
  THB: {
    code: 'THB',
    name: 'Thai Baht',
    symbol: '฿',
    rate: 35.0
  },
  TJS: {
    code: 'TJS',
    name: 'Tajikistani Somoni',
    symbol: 'SM',
    rate: 10.9
  },
  TMT: {
    code: 'TMT',
    name: 'Turkmenistani Manat',
    symbol: 'T',
    rate: 3.5
  },
  TND: {
    code: 'TND',
    name: 'Tunisian Dinar',
    symbol: 'د.ت',
    rate: 3.1
  },
  TOP: {
    code: 'TOP',
    name: 'Tongan Paʻanga',
    symbol: 'T$',
    rate: 2.3
  },
  TRY: {
    code: 'TRY',
    name: 'Turkish Lira',
    symbol: '₺',
    rate: 30.0
  },
  TTD: {
    code: 'TTD',
    name: 'Trinidad and Tobago Dollar',
    symbol: 'TT$',
    rate: 6.8
  },
  TWD: {
    code: 'TWD',
    name: 'New Taiwan Dollar',
    symbol: 'NT$',
    rate: 31.0
  },
  TZS: {
    code: 'TZS',
    name: 'Tanzanian Shilling',
    symbol: 'TSh',
    rate: 2500.0
  },
  UAH: {
    code: 'UAH',
    name: 'Ukrainian Hryvnia',
    symbol: '₴',
    rate: 37.0
  },
  UGX: {
    code: 'UGX',
    name: 'Ugandan Shilling',
    symbol: 'USh',
    rate: 3700.0
  },
  UYU: {
    code: 'UYU',
    name: 'Uruguayan Peso',
    symbol: '$U',
    rate: 39.0
  },
  UZS: {
    code: 'UZS',
    name: 'Uzbekistan Som',
    symbol: 'лв',
    rate: 12300.0
  },
  VES: {
    code: 'VES',
    name: 'Venezuelan Bolívar',
    symbol: 'Bs',
    rate: 36.0
  },
  VND: {
    code: 'VND',
    name: 'Vietnamese Dong',
    symbol: '₫',
    rate: 24000.0
  },
  VUV: {
    code: 'VUV',
    name: 'Vanuatu Vatu',
    symbol: 'VT',
    rate: 119.0
  },
  WST: {
    code: 'WST',
    name: 'Samoan Tala',
    symbol: 'WS$',
    rate: 2.7
  },
  XAF: {
    code: 'XAF',
    name: 'CFA Franc BEAC',
    symbol: 'FCFA',
    rate: 590.0
  },
  XCD: {
    code: 'XCD',
    name: 'East Caribbean Dollar',
    symbol: '$',
    rate: 2.7
  },
  XDR: {
    code: 'XDR',
    name: 'Special Drawing Rights',
    symbol: 'SDR',
    rate: 0.75
  },
  XOF: {
    code: 'XOF',
    name: 'CFA Franc BCEAO',
    symbol: 'CFA',
    rate: 590.0
  },
  XPF: {
    code: 'XPF',
    name: 'CFP Franc',
    symbol: '₣',
    rate: 101.0
  },
  YER: {
    code: 'YER',
    name: 'Yemeni Rial',
    symbol: '﷼',
    rate: 250.0
  },
  IMP: {
    code: 'IMP',
    name: 'Manx pound',
    symbol: '£',
    rate: 0.73
  },
  ZMW: {
    code: 'ZMW',
    name: 'Zambian Kwacha',
    symbol: 'ZK',
    rate: 27.0
  },
  ZWL: {
    code: 'ZWL',
    name: 'Zimbabwean Dollar',
    symbol: 'Z$',
    rate: 322.0
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