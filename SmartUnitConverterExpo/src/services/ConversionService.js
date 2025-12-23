// ConversionService.js - Core conversion logic for Expo app

class ConversionService {
  constructor() {
    this.currencyRates = {};
    this.cryptoRates = {};
    this.lastCurrencyUpdate = null;
    this.lastCryptoUpdate = null;
    this.CURRENCY_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    this.CRYPTO_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    
    // Initialize categories after constructor
    this.initCategories();
  }

  // Initialize comprehensive conversion data with 15+ categories and 120+ units
  initCategories() {
    this.categories = {
    length: {
      name: 'Length',
      icon: '📏',
      units: {
        'meters': { name: 'Meter', factor: 1.0 },
        'kilometers': { name: 'Kilometer', factor: 1000.0 },
        'centimeters': { name: 'Centimeter', factor: 0.01 },
        'millimeters': { name: 'Millimeter', factor: 0.001 },
        'micrometers': { name: 'Micrometer', factor: 0.000001 },
        'nanometers': { name: 'Nanometer', factor: 1e-9 },
        'miles': { name: 'Mile', factor: 1609.344 },
        'yards': { name: 'Yard', factor: 0.9144 },
        'feet': { name: 'Foot', factor: 0.3048 },
        'inches': { name: 'Inch', factor: 0.0254 },
        'nautical_miles': { name: 'Nautical Mile', factor: 1852.0 },
        'light_years': { name: 'Light Year', factor: 9.461e15 },
        'astronomical_units': { name: 'Astronomical Unit', factor: 1.496e11 },
        'parsecs': { name: 'Parsec', factor: 3.086e16 },
        'angstroms': { name: 'Angstrom', factor: 1e-10 }
      }
    },
    weight: {
      name: 'Weight',
      icon: '⚖️',
      units: {
        'kilograms': { name: 'Kilogram', factor: 1.0 },
        'grams': { name: 'Gram', factor: 0.001 },
        'milligrams': { name: 'Milligram', factor: 0.000001 },
        'micrograms': { name: 'Microgram', factor: 1e-9 },
        'pounds': { name: 'Pound', factor: 0.45359237 },
        'ounces': { name: 'Ounce', factor: 0.028349523125 },
        'tons': { name: 'Ton', factor: 1000.0 },
        'metric_tons': { name: 'Metric Ton', factor: 1000.0 },
        'stone': { name: 'Stone', factor: 6.35029318 },
        'carats': { name: 'Carat', factor: 0.0002 },
        'atomic_mass_units': { name: 'Atomic Mass Unit', factor: 1.66053907e-27 }
      }
    },
    temperature: {
      name: 'Temperature',
      icon: '🌡️',
      units: {
        'celsius': { name: 'Celsius', factor: 1, offset: 0 },
        'fahrenheit': { name: 'Fahrenheit', factor: 5/9, offset: -32 },
        'kelvin': { name: 'Kelvin', factor: 1, offset: -273.15 },
        'rankine': { name: 'Rankine', factor: 5/9, offset: -491.67 }
      }
    },
    volume: {
      name: 'Volume',
      icon: '🧊',
      units: {
        'liters': { name: 'Liter', factor: 1.0 },
        'milliliters': { name: 'Milliliter', factor: 0.001 },
        'cubic_meters': { name: 'Cubic Meter', factor: 1000.0 },
        'gallons': { name: 'Gallon', factor: 3.78541 },
        'quarts': { name: 'Quart', factor: 0.946353 },
        'pints': { name: 'Pint', factor: 0.473176 },
        'cups': { name: 'Cup', factor: 0.236588 },
        'cubic_feet': { name: 'Cubic Foot', factor: 28.3168 },
        'cubic_yards': { name: 'Cubic Yard', factor: 764.555 }
      }
    },
    area: {
      name: 'Area',
      icon: '📐',
      units: {
        'square_meters': { name: 'Square Meter', factor: 1.0 },
        'square_kilometers': { name: 'Square Kilometer', factor: 1000000.0 },
        'square_feet': { name: 'Square Foot', factor: 0.092903 },
        'square_yards': { name: 'Square Yard', factor: 0.836127 },
        'acres': { name: 'Acre', factor: 4046.86 },
        'hectares': { name: 'Hectare', factor: 10000.0 },
        'square_miles': { name: 'Square Mile', factor: 2589988.0 }
      }
    },
    speed: {
      name: 'Speed',
      icon: '🏃',
      units: {
        'meters_per_second': { name: 'Meter/Second', factor: 1.0 },
        'kilometers_per_hour': { name: 'Kilometer/Hour', factor: 0.277778 },
        'miles_per_hour': { name: 'Mile/Hour', factor: 0.44704 },
        'knots': { name: 'Knot', factor: 0.514444 },
        'feet_per_second': { name: 'Foot/Second', factor: 0.3048 },
        'mach': { name: 'Mach', factor: 340.29 }
      }
    },
    time: {
      name: 'Time',
      icon: '⏰',
      units: {
        'seconds': { name: 'Second', factor: 1.0 },
        'minutes': { name: 'Minute', factor: 60.0 },
        'hours': { name: 'Hour', factor: 3600.0 },
        'days': { name: 'Day', factor: 86400.0 },
        'weeks': { name: 'Week', factor: 604800.0 },
        'years': { name: 'Year', factor: 31536000.0 },
        'decades': { name: 'Decade', factor: 315360000.0 },
        'centuries': { name: 'Century', factor: 3153600000.0 }
      }
    },
    digital_storage_binary: {
      name: 'Digital Storage (Binary)',
      icon: '💾',
      units: {
        'bytes': { name: 'Byte', factor: 1.0 },
        'kibibytes': { name: 'Kibibyte', factor: 1024.0 },
        'mebibytes': { name: 'Mebibyte', factor: 1048576.0 },
        'gibibytes': { name: 'Gibibyte', factor: 1073741824.0 },
        'tebibytes': { name: 'Tebibyte', factor: 1099511627776.0 },
        'pebibytes': { name: 'Pebibyte', factor: 1125899906842624.0 }
      }
    },
    digital_storage_decimal: {
      name: 'Digital Storage (Decimal)',
      icon: '💿',
      units: {
        'bytes': { name: 'Byte', factor: 1.0 },
        'kilobytes': { name: 'Kilobyte', factor: 1000.0 },
        'megabytes': { name: 'Megabyte', factor: 1000000.0 },
        'gigabytes': { name: 'Gigabyte', factor: 1000000000.0 },
        'terabytes': { name: 'Terabyte', factor: 1000000000000.0 },
        'petabytes': { name: 'Petabyte', factor: 1000000000000000.0 }
      }
    },
    energy: {
      name: 'Energy',
      icon: '⚡',
      units: {
        'joules': { name: 'Joule', factor: 1.0 },
        'kilojoules': { name: 'Kilojoule', factor: 1000.0 },
        'calories': { name: 'Calorie', factor: 4.184 },
        'kilocalories': { name: 'Kilocalorie', factor: 4184.0 },
        'watt_hours': { name: 'Watt Hour', factor: 3600.0 },
        'kilowatt_hours': { name: 'Kilowatt Hour', factor: 3600000.0 },
        'electron_volts': { name: 'Electron Volt', factor: 1.602e-19 }
      }
    },
    power: {
      name: 'Power',
      icon: '🔋',
      units: {
        'watts': { name: 'Watt', factor: 1.0 },
        'kilowatts': { name: 'Kilowatt', factor: 1000.0 },
        'megawatts': { name: 'Megawatt', factor: 1000000.0 },
        'horsepower': { name: 'Horsepower', factor: 745.7 },
        'btu_per_hour': { name: 'BTU/Hour', factor: 0.293 }
      }
    },
    pressure: {
      name: 'Pressure',
      icon: '🌪️',
      units: {
        'pascals': { name: 'Pascal', factor: 1.0 },
        'kilopascals': { name: 'Kilopascal', factor: 1000.0 },
        'megapascals': { name: 'Megapascal', factor: 1000000.0 },
        'bars': { name: 'Bar', factor: 100000.0 },
        'atmospheres': { name: 'Atmosphere', factor: 101325.0 },
        'psi': { name: 'PSI', factor: 6894.76 },
        'torr': { name: 'Torr', factor: 133.322 }
      }
    },
    data_transfer: {
      name: 'Data Transfer',
      icon: '📡',
      units: {
        'bits_per_second': { name: 'Bit/Second', factor: 1.0 },
        'kilobits_per_second': { name: 'Kilobit/Second', factor: 1000.0 },
        'megabits_per_second': { name: 'Megabit/Second', factor: 1000000.0 },
        'gigabits_per_second': { name: 'Gigabit/Second', factor: 1000000000.0 },
        'bytes_per_second': { name: 'Byte/Second', factor: 8.0 },
        'kilobytes_per_second': { name: 'Kilobyte/Second', factor: 8000.0 },
        'megabytes_per_second': { name: 'Megabyte/Second', factor: 8000000.0 }
      }
    },
    frequency: {
      name: 'Frequency',
      icon: '📻',
      units: {
        'hertz': { name: 'Hertz', factor: 1.0 },
        'kilohertz': { name: 'Kilohertz', factor: 1000.0 },
        'megahertz': { name: 'Megahertz', factor: 1000000.0 },
        'gigahertz': { name: 'Gigahertz', factor: 1000000000.0 },
        'terahertz': { name: 'Terahertz', factor: 1000000000000.0 }
      }
    },
    cooking_volume: {
      name: 'Cooking Volume',
      icon: '🍽️',
      units: {
        'cups': { name: 'Cup', factor: 1.0 },
        'tablespoons': { name: 'Tablespoon', factor: 0.0625 },
        'teaspoons': { name: 'Teaspoon', factor: 0.0208333 },
        'fluid_ounces': { name: 'Fluid Ounce', factor: 0.125 },
        'pints': { name: 'Pint', factor: 2.0 },
        'quarts': { name: 'Quart', factor: 4.0 },
        'gallons': { name: 'Gallon', factor: 16.0 },
        'milliliters': { name: 'Milliliter', factor: 236.588 },
        'liters': { name: 'Liter', factor: 0.236588 },
        'cubic_inches': { name: 'Cubic Inch', factor: 14.4375 },
        'cubic_centimeters': { name: 'Cubic Centimeter', factor: 236.588 }
      }
    },
    cooking_weight: {
      name: 'Cooking Weight',
      icon: '🥄',
      units: {
        'ounces': { name: 'Ounce', factor: 1.0 },
        'pounds': { name: 'Pound', factor: 16.0 },
        'grams': { name: 'Gram', factor: 28.3495 },
        'kilograms': { name: 'Kilogram', factor: 28349.5 },
        'cups_flour': { name: 'Cup (Flour)', factor: 4.25 },
        'cups_sugar': { name: 'Cup (Sugar)', factor: 7.0 },
        'cups_butter': { name: 'Cup (Butter)', factor: 8.0 },
        'tablespoons_butter': { name: 'Tablespoon (Butter)', factor: 0.5 },
        'teaspoons_salt': { name: 'Teaspoon (Salt)', factor: 5.69 }
      }
    },
    baking_temperature: {
      name: 'Baking Temperature',
      icon: '🔥',
      units: {
        'fahrenheit': { name: 'Fahrenheit', factor: 1 },
        'celsius': { name: 'Celsius', factor: 1 },
        'gas_mark_1': { name: 'Gas Mark 1', factor: 275 },
        'gas_mark_2': { name: 'Gas Mark 2', factor: 300 },
        'gas_mark_3': { name: 'Gas Mark 3', factor: 325 },
        'gas_mark_4': { name: 'Gas Mark 4', factor: 350 },
        'gas_mark_5': { name: 'Gas Mark 5', factor: 375 },
        'gas_mark_6': { name: 'Gas Mark 6', factor: 400 },
        'gas_mark_7': { name: 'Gas Mark 7', factor: 425 },
        'gas_mark_8': { name: 'Gas Mark 8', factor: 450 },
        'gas_mark_9': { name: 'Gas Mark 9', factor: 475 }
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
  }

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
      case 'rankine':
        celsius = (value - 491.67) * 5/9;
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
      case 'rankine':
        return (celsius * 9/5) + 491.67;
      default:
        throw new Error('Invalid temperature unit');
    }
  }

  // Baking temperature conversion
  convertBakingTemperature(value, fromUnit, toUnit) {
    // Convert to Fahrenheit first (standard for baking)
    let fahrenheit;
    if (fromUnit === 'celsius') {
      fahrenheit = value * 9/5 + 32;
    } else if (fromUnit === 'fahrenheit') {
      fahrenheit = value;
    } else if (fromUnit.startsWith('gas_mark_')) {
      // Gas mark to Fahrenheit conversion
      const gasMark = parseInt(fromUnit.split('_')[2]);
      fahrenheit = 275 + (gasMark - 1) * 25; // Gas mark 1 = 275°F, each mark = +25°F
    } else {
      fahrenheit = value;
    }

    // Convert from Fahrenheit to target unit
    if (toUnit === 'celsius') {
      return (fahrenheit - 32) * 5/9;
    } else if (toUnit === 'fahrenheit') {
      return fahrenheit;
    } else if (toUnit.startsWith('gas_mark_')) {
      // Fahrenheit to gas mark conversion
      const gasMark = Math.round((fahrenheit - 275) / 25) + 1;
      return Math.max(1, Math.min(9, gasMark)); // Clamp between 1-9
    } else {
      return fahrenheit;
    }
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
