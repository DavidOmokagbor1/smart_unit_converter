// ConversionService.js - Core conversion logic for React Native app

class ConversionService {
  constructor() {
    this.currencyRates = {};
    this.cryptoRates = {};
    this.lastCurrencyUpdate = null;
    this.lastCryptoUpdate = null;
    this.CURRENCY_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    this.CRYPTO_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  }

  // Conversion categories and units (same as web app)
  categories = {
    length: {
      name: 'Length',
      icon: '📏',
      units: {
        'mm': { name: 'Millimeter', factor: 0.001 },
        'cm': { name: 'Centimeter', factor: 0.01 },
        'm': { name: 'Meter', factor: 1 },
        'km': { name: 'Kilometer', factor: 1000 },
        'in': { name: 'Inch', factor: 0.0254 },
        'ft': { name: 'Foot', factor: 0.3048 },
        'yd': { name: 'Yard', factor: 0.9144 },
        'mi': { name: 'Mile', factor: 1609.34 }
      }
    },
    weight: {
      name: 'Weight',
      icon: '⚖️',
      units: {
        'mg': { name: 'Milligram', factor: 0.001 },
        'g': { name: 'Gram', factor: 1 },
        'kg': { name: 'Kilogram', factor: 1000 },
        'oz': { name: 'Ounce', factor: 28.3495 },
        'lb': { name: 'Pound', factor: 453.592 },
        't': { name: 'Metric Ton', factor: 1000000 }
      }
    },
    temperature: {
      name: 'Temperature',
      icon: '🌡️',
      units: {
        'celsius': { name: 'Celsius', factor: 1, offset: 0 },
        'fahrenheit': { name: 'Fahrenheit', factor: 5/9, offset: -32 },
        'kelvin': { name: 'Kelvin', factor: 1, offset: -273.15 }
      }
    },
    currency: {
      name: 'Currency (Real-time)',
      icon: '💱',
      units: {
        'USD': { name: 'US Dollar', factor: 1 },
        'EUR': { name: 'Euro', factor: 1 },
        'GBP': { name: 'British Pound', factor: 1 },
        'JPY': { name: 'Japanese Yen', factor: 1 },
        'CNY': { name: 'Chinese Yuan', factor: 1 },
        'INR': { name: 'Indian Rupee', factor: 1 },
        'AUD': { name: 'Australian Dollar', factor: 1 },
        'CAD': { name: 'Canadian Dollar', factor: 1 },
        'CHF': { name: 'Swiss Franc', factor: 1 },
        'SEK': { name: 'Swedish Krona', factor: 1 },
        'NOK': { name: 'Norwegian Krone', factor: 1 },
        'DKK': { name: 'Danish Krone', factor: 1 },
        'PLN': { name: 'Polish Zloty', factor: 1 },
        'CZK': { name: 'Czech Koruna', factor: 1 },
        'HUF': { name: 'Hungarian Forint', factor: 1 },
        'RUB': { name: 'Russian Ruble', factor: 1 },
        'BRL': { name: 'Brazilian Real', factor: 1 },
        'MXN': { name: 'Mexican Peso', factor: 1 },
        'ZAR': { name: 'South African Rand', factor: 1 },
        'KRW': { name: 'South Korean Won', factor: 1 },
        'SGD': { name: 'Singapore Dollar', factor: 1 },
        'HKD': { name: 'Hong Kong Dollar', factor: 1 },
        'NZD': { name: 'New Zealand Dollar', factor: 1 },
        'TRY': { name: 'Turkish Lira', factor: 1 },
        'AED': { name: 'UAE Dirham', factor: 1 },
        'SAR': { name: 'Saudi Riyal', factor: 1 },
        'QAR': { name: 'Qatari Riyal', factor: 1 },
        'KWD': { name: 'Kuwaiti Dinar', factor: 1 },
        'BHD': { name: 'Bahraini Dinar', factor: 1 },
        'OMR': { name: 'Omani Rial', factor: 1 },
        'JOD': { name: 'Jordanian Dinar', factor: 1 },
        'LBP': { name: 'Lebanese Pound', factor: 1 },
        'EGP': { name: 'Egyptian Pound', factor: 1 },
        'MAD': { name: 'Moroccan Dirham', factor: 1 },
        'TND': { name: 'Tunisian Dinar', factor: 1 },
        'DZD': { name: 'Algerian Dinar', factor: 1 },
        'LYD': { name: 'Libyan Dinar', factor: 1 },
        'SDG': { name: 'Sudanese Pound', factor: 1 },
        'ETB': { name: 'Ethiopian Birr', factor: 1 },
        'KES': { name: 'Kenyan Shilling', factor: 1 },
        'UGX': { name: 'Ugandan Shilling', factor: 1 },
        'TZS': { name: 'Tanzanian Shilling', factor: 1 },
        'RWF': { name: 'Rwandan Franc', factor: 1 },
        'BIF': { name: 'Burundian Franc', factor: 1 },
        'DJF': { name: 'Djiboutian Franc', factor: 1 },
        'SOS': { name: 'Somali Shilling', factor: 1 },
        'ERN': { name: 'Eritrean Nakfa', factor: 1 },
        'SLL': { name: 'Sierra Leonean Leone', factor: 1 },
        'GMD': { name: 'Gambian Dalasi', factor: 1 },
        'GNF': { name: 'Guinean Franc', factor: 1 },
        'LRD': { name: 'Liberian Dollar', factor: 1 },
        'CDF': { name: 'Congolese Franc', factor: 1 },
        'AOA': { name: 'Angolan Kwanza', factor: 1 },
        'ZMW': { name: 'Zambian Kwacha', factor: 1 },
        'BWP': { name: 'Botswana Pula', factor: 1 },
        'SZL': { name: 'Swazi Lilangeni', factor: 1 },
        'LSL': { name: 'Lesotho Loti', factor: 1 },
        'NAD': { name: 'Namibian Dollar', factor: 1 },
        'MZN': { name: 'Mozambican Metical', factor: 1 },
        'MGA': { name: 'Malagasy Ariary', factor: 1 },
        'MUR': { name: 'Mauritian Rupee', factor: 1 },
        'SCR': { name: 'Seychellois Rupee', factor: 1 },
        'KMF': { name: 'Comorian Franc', factor: 1 },
        'MVR': { name: 'Maldivian Rufiyaa', factor: 1 },
        'LKR': { name: 'Sri Lankan Rupee', factor: 1 },
        'BDT': { name: 'Bangladeshi Taka', factor: 1 },
        'NPR': { name: 'Nepalese Rupee', factor: 1 },
        'BTN': { name: 'Bhutanese Ngultrum', factor: 1 },
        'PKR': { name: 'Pakistani Rupee', factor: 1 },
        'AFN': { name: 'Afghan Afghani', factor: 1 },
        'TJS': { name: 'Tajikistani Somoni', factor: 1 },
        'TMT': { name: 'Turkmenistani Manat', factor: 1 },
        'UZS': { name: 'Uzbekistani Som', factor: 1 },
        'KGS': { name: 'Kyrgyzstani Som', factor: 1 },
        'KZT': { name: 'Kazakhstani Tenge', factor: 1 },
        'MNT': { name: 'Mongolian Tugrik', factor: 1 },
        'AMD': { name: 'Armenian Dram', factor: 1 },
        'AZN': { name: 'Azerbaijani Manat', factor: 1 },
        'GEL': { name: 'Georgian Lari', factor: 1 },
        'MDL': { name: 'Moldovan Leu', factor: 1 },
        'UAH': { name: 'Ukrainian Hryvnia', factor: 1 },
        'BYN': { name: 'Belarusian Ruble', factor: 1 },
        'BGN': { name: 'Bulgarian Lev', factor: 1 },
        'RON': { name: 'Romanian Leu', factor: 1 },
        'HRK': { name: 'Croatian Kuna', factor: 1 },
        'RSD': { name: 'Serbian Dinar', factor: 1 },
        'BAM': { name: 'Bosnia-Herzegovina Convertible Mark', factor: 1 },
        'MKD': { name: 'Macedonian Denar', factor: 1 },
        'ALL': { name: 'Albanian Lek', factor: 1 },
        'ISK': { name: 'Icelandic Krona', factor: 1 },
        'ILS': { name: 'Israeli New Shekel', factor: 1 },
        'JOD': { name: 'Jordanian Dinar', factor: 1 },
        'LBP': { name: 'Lebanese Pound', factor: 1 },
        'SYP': { name: 'Syrian Pound', factor: 1 },
        'IQD': { name: 'Iraqi Dinar', factor: 1 },
        'IRR': { name: 'Iranian Rial', factor: 1 },
        'AFN': { name: 'Afghan Afghani', factor: 1 },
        'PKR': { name: 'Pakistani Rupee', factor: 1 },
        'NPR': { name: 'Nepalese Rupee', factor: 1 },
        'BDT': { name: 'Bangladeshi Taka', factor: 1 },
        'LKR': { name: 'Sri Lankan Rupee', factor: 1 },
        'MVR': { name: 'Maldivian Rufiyaa', factor: 1 },
        'BTN': { name: 'Bhutanese Ngultrum', factor: 1 },
        'MMK': { name: 'Myanmar Kyat', factor: 1 },
        'THB': { name: 'Thai Baht', factor: 1 },
        'LAK': { name: 'Lao Kip', factor: 1 },
        'KHR': { name: 'Cambodian Riel', factor: 1 },
        'VND': { name: 'Vietnamese Dong', factor: 1 },
        'IDR': { name: 'Indonesian Rupiah', factor: 1 },
        'MYR': { name: 'Malaysian Ringgit', factor: 1 },
        'PHP': { name: 'Philippine Peso', factor: 1 },
        'TWD': { name: 'Taiwan New Dollar', factor: 1 },
        'HKD': { name: 'Hong Kong Dollar', factor: 1 },
        'MOP': { name: 'Macanese Pataca', factor: 1 },
        'BND': { name: 'Brunei Dollar', factor: 1 },
        'SGD': { name: 'Singapore Dollar', factor: 1 },
        'IDR': { name: 'Indonesian Rupiah', factor: 1 },
        'MYR': { name: 'Malaysian Ringgit', factor: 1 },
        'THB': { name: 'Thai Baht', factor: 1 },
        'VND': { name: 'Vietnamese Dong', factor: 1 },
        'KHR': { name: 'Cambodian Riel', factor: 1 },
        'LAK': { name: 'Lao Kip', factor: 1 },
        'MMK': { name: 'Myanmar Kyat', factor: 1 },
        'BDT': { name: 'Bangladeshi Taka', factor: 1 },
        'LKR': { name: 'Sri Lankan Rupee', factor: 1 },
        'MVR': { name: 'Maldivian Rufiyaa', factor: 1 },
        'NPR': { name: 'Nepalese Rupee', factor: 1 },
        'PKR': { name: 'Pakistani Rupee', factor: 1 },
        'AFN': { name: 'Afghan Afghani', factor: 1 },
        'IRR': { name: 'Iranian Rial', factor: 1 },
        'IQD': { name: 'Iraqi Dinar', factor: 1 },
        'SYP': { name: 'Syrian Pound', factor: 1 },
        'LBP': { name: 'Lebanese Pound', factor: 1 },
        'JOD': { name: 'Jordanian Dinar', factor: 1 },
        'ILS': { name: 'Israeli New Shekel', factor: 1 },
        'PAL': { name: 'Palestinian Pound', factor: 1 },
        'EGP': { name: 'Egyptian Pound', factor: 1 },
        'LYD': { name: 'Libyan Dinar', factor: 1 },
        'TND': { name: 'Tunisian Dinar', factor: 1 },
        'DZD': { name: 'Algerian Dinar', factor: 1 },
        'MAD': { name: 'Moroccan Dirham', factor: 1 },
        'MRO': { name: 'Mauritanian Ouguiya', factor: 1 },
        'XOF': { name: 'West African CFA Franc', factor: 1 },
        'XAF': { name: 'Central African CFA Franc', factor: 1 },
        'CDF': { name: 'Congolese Franc', factor: 1 },
        'AOA': { name: 'Angolan Kwanza', factor: 1 },
        'ZMW': { name: 'Zambian Kwacha', factor: 1 },
        'BWP': { name: 'Botswana Pula', factor: 1 },
        'SZL': { name: 'Swazi Lilangeni', factor: 1 },
        'LSL': { name: 'Lesotho Loti', factor: 1 },
        'NAD': { name: 'Namibian Dollar', factor: 1 },
        'MZN': { name: 'Mozambican Metical', factor: 1 },
        'MGA': { name: 'Malagasy Ariary', factor: 1 },
        'MUR': { name: 'Mauritian Rupee', factor: 1 },
        'SCR': { name: 'Seychellois Rupee', factor: 1 },
        'KMF': { name: 'Comorian Franc', factor: 1 },
        'MVR': { name: 'Maldivian Rufiyaa', factor: 1 },
        'LKR': { name: 'Sri Lankan Rupee', factor: 1 },
        'BDT': { name: 'Bangladeshi Taka', factor: 1 },
        'NPR': { name: 'Nepalese Rupee', factor: 1 },
        'BTN': { name: 'Bhutanese Ngultrum', factor: 1 },
        'PKR': { name: 'Pakistani Rupee', factor: 1 },
        'AFN': { name: 'Afghan Afghani', factor: 1 },
        'TJS': { name: 'Tajikistani Somoni', factor: 1 },
        'TMT': { name: 'Turkmenistani Manat', factor: 1 },
        'UZS': { name: 'Uzbekistani Som', factor: 1 },
        'KGS': { name: 'Kyrgyzstani Som', factor: 1 },
        'KZT': { name: 'Kazakhstani Tenge', factor: 1 },
        'MNT': { name: 'Mongolian Tugrik', factor: 1 },
        'AMD': { name: 'Armenian Dram', factor: 1 },
        'AZN': { name: 'Azerbaijani Manat', factor: 1 },
        'GEL': { name: 'Georgian Lari', factor: 1 },
        'MDL': { name: 'Moldovan Leu', factor: 1 },
        'UAH': { name: 'Ukrainian Hryvnia', factor: 1 },
        'BYN': { name: 'Belarusian Ruble', factor: 1 },
        'BGN': { name: 'Bulgarian Lev', factor: 1 },
        'RON': { name: 'Romanian Leu', factor: 1 },
        'HRK': { name: 'Croatian Kuna', factor: 1 },
        'RSD': { name: 'Serbian Dinar', factor: 1 },
        'BAM': { name: 'Bosnia-Herzegovina Convertible Mark', factor: 1 },
        'MKD': { name: 'Macedonian Denar', factor: 1 },
        'ALL': { name: 'Albanian Lek', factor: 1 },
        'ISK': { name: 'Icelandic Krona', factor: 1 },
        'ILS': { name: 'Israeli New Shekel', factor: 1 },
        'JOD': { name: 'Jordanian Dinar', factor: 1 },
        'LBP': { name: 'Lebanese Pound', factor: 1 },
        'SYP': { name: 'Syrian Pound', factor: 1 },
        'IQD': { name: 'Iraqi Dinar', factor: 1 },
        'IRR': { name: 'Iranian Rial', factor: 1 },
        'AFN': { name: 'Afghan Afghani', factor: 1 },
        'PKR': { name: 'Pakistani Rupee', factor: 1 },
        'NPR': { name: 'Nepalese Rupee', factor: 1 },
        'BDT': { name: 'Bangladeshi Taka', factor: 1 },
        'LKR': { name: 'Sri Lankan Rupee', factor: 1 },
        'MVR': { name: 'Maldivian Rufiyaa', factor: 1 },
        'BTN': { name: 'Bhutanese Ngultrum', factor: 1 },
        'MMK': { name: 'Myanmar Kyat', factor: 1 },
        'THB': { name: 'Thai Baht', factor: 1 },
        'LAK': { name: 'Lao Kip', factor: 1 },
        'KHR': { name: 'Cambodian Riel', factor: 1 },
        'VND': { name: 'Vietnamese Dong', factor: 1 },
        'IDR': { name: 'Indonesian Rupiah', factor: 1 },
        'MYR': { name: 'Malaysian Ringgit', factor: 1 },
        'PHP': { name: 'Philippine Peso', factor: 1 },
        'TWD': { name: 'Taiwan New Dollar', factor: 1 },
        'HKD': { name: 'Hong Kong Dollar', factor: 1 },
        'MOP': { name: 'Macanese Pataca', factor: 1 },
        'BND': { name: 'Brunei Dollar', factor: 1 },
        'SGD': { name: 'Singapore Dollar', factor: 1 }
      }
    },
    crypto: {
      name: 'Cryptocurrency (Real-time)',
      icon: '₿',
      units: {
        'BTC': { name: 'Bitcoin', factor: 1 },
        'ETH': { name: 'Ethereum', factor: 1 },
        'BNB': { name: 'Binance Coin', factor: 1 },
        'ADA': { name: 'Cardano', factor: 1 },
        'SOL': { name: 'Solana', factor: 1 },
        'XRP': { name: 'Ripple', factor: 1 },
        'DOT': { name: 'Polkadot', factor: 1 },
        'DOGE': { name: 'Dogecoin', factor: 1 },
        'AVAX': { name: 'Avalanche', factor: 1 },
        'SHIB': { name: 'Shiba Inu', factor: 1 },
        'MATIC': { name: 'Polygon', factor: 1 },
        'LTC': { name: 'Litecoin', factor: 1 },
        'UNI': { name: 'Uniswap', factor: 1 },
        'LINK': { name: 'Chainlink', factor: 1 },
        'ATOM': { name: 'Cosmos', factor: 1 },
        'FTM': { name: 'Fantom', factor: 1 },
        'NEAR': { name: 'NEAR Protocol', factor: 1 },
        'ALGO': { name: 'Algorand', factor: 1 },
        'VET': { name: 'VeChain', factor: 1 },
        'ICP': { name: 'Internet Computer', factor: 1 },
        'FIL': { name: 'Filecoin', factor: 1 },
        'TRX': { name: 'TRON', factor: 1 },
        'ETC': { name: 'Ethereum Classic', factor: 1 },
        'XLM': { name: 'Stellar', factor: 1 },
        'MANA': { name: 'Decentraland', factor: 1 },
        'SAND': { name: 'The Sandbox', factor: 1 },
        'AXS': { name: 'Axie Infinity', factor: 1 },
        'CHZ': { name: 'Chiliz', factor: 1 },
        'ENJ': { name: 'Enjin Coin', factor: 1 },
        'GALA': { name: 'Gala', factor: 1 }
      }
    }
  };

  // Load currency rates from API
  async loadCurrencyRates() {
    const now = Date.now();
    
    // Check if we have recent data
    if (this.lastCurrencyUpdate && (now - this.lastCurrencyUpdate) < this.CURRENCY_CACHE_DURATION) {
      return this.currencyRates;
    }

    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      
      if (data.rates) {
        this.currencyRates = data.rates;
        this.lastCurrencyUpdate = now;
        return this.currencyRates;
      }
    } catch (error) {
      console.error('Error loading currency rates:', error);
    }

    // Fallback rates if API fails
    return {
      USD: 1, EUR: 0.85, GBP: 0.73, JPY: 110, CNY: 6.45, INR: 75,
      AUD: 1.35, CAD: 1.25, CHF: 0.92, SEK: 8.5, NOK: 8.7, DKK: 6.3,
      PLN: 3.9, CZK: 21.5, HUF: 300, RUB: 75, BRL: 5.2, MXN: 20,
      ZAR: 15, KRW: 1180, SGD: 1.35, HKD: 7.8, NZD: 1.4, TRY: 8.5
    };
  }

  // Load cryptocurrency rates from API
  async loadCryptoRates() {
    const now = Date.now();
    
    // Check if we have recent data
    if (this.lastCryptoUpdate && (now - this.lastCryptoUpdate) < this.CRYPTO_CACHE_DURATION) {
      return this.cryptoRates;
    }

    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,cardano,solana,ripple,polkadot,dogecoin,avalanche-2,shiba-inu,matic-network,litecoin,uniswap,chainlink,cosmos,fantom,near,algorand,vechain,internet-computer,filecoin,tron,ethereum-classic,stellar,decentraland,the-sandbox,axie-infinity,chiliz,enjincoin,gala&vs_currencies=usd');
      const data = await response.json();
      
      if (data) {
        this.cryptoRates = {};
        Object.keys(data).forEach(key => {
          const coin = data[key];
          if (coin.usd) {
            // Map coin IDs to our unit codes
            const unitMap = {
              'bitcoin': 'BTC', 'ethereum': 'ETH', 'binancecoin': 'BNB',
              'cardano': 'ADA', 'solana': 'SOL', 'ripple': 'XRP',
              'polkadot': 'DOT', 'dogecoin': 'DOGE', 'avalanche-2': 'AVAX',
              'shiba-inu': 'SHIB', 'matic-network': 'MATIC', 'litecoin': 'LTC',
              'uniswap': 'UNI', 'chainlink': 'LINK', 'cosmos': 'ATOM',
              'fantom': 'FTM', 'near': 'NEAR', 'algorand': 'ALGO',
              'vechain': 'VET', 'internet-computer': 'ICP', 'filecoin': 'FIL',
              'tron': 'TRX', 'ethereum-classic': 'ETC', 'stellar': 'XLM',
              'decentraland': 'MANA', 'the-sandbox': 'SAND', 'axie-infinity': 'AXS',
              'chiliz': 'CHZ', 'enjincoin': 'ENJ', 'gala': 'GALA'
            };
            
            const unit = unitMap[key];
            if (unit) {
              this.cryptoRates[unit] = coin.usd;
            }
          }
        });
        
        this.lastCryptoUpdate = now;
        return this.cryptoRates;
      }
    } catch (error) {
      console.error('Error loading crypto rates:', error);
    }

    // Fallback rates if API fails
    return {
      BTC: 45000, ETH: 3000, BNB: 300, ADA: 0.5, SOL: 100,
      XRP: 0.8, DOT: 20, DOGE: 0.08, AVAX: 25, SHIB: 0.00001,
      MATIC: 1.5, LTC: 150, UNI: 20, LINK: 15, ATOM: 10,
      FTM: 2, NEAR: 5, ALGO: 0.3, VET: 0.05, ICP: 10,
      FIL: 5, TRX: 0.1, ETC: 30, XLM: 0.2, MANA: 0.5,
      SAND: 0.8, AXS: 15, CHZ: 0.2, ENJ: 0.3, GALA: 0.1
    };
  }

  // Perform conversion
  async convert(value, fromUnit, toUnit, category) {
    if (!value || isNaN(value)) {
      throw new Error('Invalid value');
    }

    const numValue = parseFloat(value);
    
    if (category === 'currency') {
      const rates = await this.loadCurrencyRates();
      const fromRate = rates[fromUnit] || 1;
      const toRate = rates[toUnit] || 1;
      return (numValue / fromRate) * toRate;
    }
    
    if (category === 'crypto') {
      const rates = await this.loadCryptoRates();
      const fromRate = rates[fromUnit] || 1;
      const toRate = rates[toUnit] || 1;
      return (numValue / fromRate) * toRate;
    }
    
    if (category === 'temperature') {
      return this.convertTemperature(numValue, fromUnit, toUnit);
    }
    
    if (category === 'baking_temperature') {
      return this.convertBakingTemperature(numValue, fromUnit, toUnit);
    }
    
    // Linear conversion for other categories
    const categoryData = this.categories[category];
    if (!categoryData || !categoryData.units[fromUnit] || !categoryData.units[toUnit]) {
      throw new Error('Invalid units for conversion');
    }
    
    const fromFactor = categoryData.units[fromUnit].factor;
    const toFactor = categoryData.units[toUnit].factor;
    
    return (numValue * fromFactor) / toFactor;
  }

  // Temperature conversion
  convertTemperature(value, fromUnit, toUnit) {
    // Convert to Celsius first
    let celsius;
    switch (fromUnit) {
      case 'celsius':
        celsius = value;
        break;
      case 'fahrenheit':
        celsius = (value - 32) * 5/9;
        break;
      case 'kelvin':
        celsius = value - 273.15;
        break;
      default:
        throw new Error('Invalid temperature unit');
    }
    
    // Convert from Celsius to target unit
    switch (toUnit) {
      case 'celsius':
        return celsius;
      case 'fahrenheit':
        return (celsius * 9/5) + 32;
      case 'kelvin':
        return celsius + 273.15;
      default:
        throw new Error('Invalid temperature unit');
    }
  }

  // Baking temperature conversion
  convertBakingTemperature(value, fromUnit, toUnit) {
    // Convert to Celsius first
    let celsius;
    switch (fromUnit) {
      case 'celsius':
        celsius = value;
        break;
      case 'fahrenheit':
        celsius = (value - 32) * 5/9;
        break;
      case 'gas_mark':
        celsius = this.gasMarkToCelsius(value);
        break;
      default:
        throw new Error('Invalid baking temperature unit');
    }
    
    // Convert from Celsius to target unit
    switch (toUnit) {
      case 'celsius':
        return celsius;
      case 'fahrenheit':
        return (celsius * 9/5) + 32;
      case 'gas_mark':
        return this.celsiusToGasMark(celsius);
      default:
        throw new Error('Invalid baking temperature unit');
    }
  }

  // Gas mark conversion helpers
  gasMarkToCelsius(gasMark) {
    const gasMarkTemps = {
      1: 140, 2: 150, 3: 160, 4: 180, 5: 190,
      6: 200, 7: 220, 8: 230, 9: 240, 10: 250
    };
    return gasMarkTemps[gasMark] || 180;
  }

  celsiusToGasMark(celsius) {
    const gasMarkTemps = [
      { mark: 1, temp: 140 }, { mark: 2, temp: 150 }, { mark: 3, temp: 160 },
      { mark: 4, temp: 180 }, { mark: 5, temp: 190 }, { mark: 6, temp: 200 },
      { mark: 7, temp: 220 }, { mark: 8, temp: 230 }, { mark: 9, temp: 240 },
      { mark: 10, temp: 250 }
    ];
    
    for (let i = 0; i < gasMarkTemps.length - 1; i++) {
      const current = gasMarkTemps[i];
      const next = gasMarkTemps[i + 1];
      
      if (celsius >= current.temp && celsius < next.temp) {
        return current.mark;
      }
    }
    
    return celsius >= 250 ? 10 : 1;
  }

  // Get all categories
  getCategories() {
    return Object.keys(this.categories).map(key => ({
      key,
      ...this.categories[key]
    }));
  }

  // Get units for a category
  getUnitsForCategory(category) {
    return this.categories[category]?.units || {};
  }
}

export default new ConversionService();
