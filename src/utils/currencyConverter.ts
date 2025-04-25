
// Exchange rates (as of April 2025)
// In a production app, these would be fetched from an API
const exchangeRates: Record<string, number> = {
  USD_INR: 83.5, // 1 USD to INR
  USD_EUR: 0.92, // 1 USD to EUR
  USD_JPY: 108.75, // 1 USD to JPY
  USD_GBP: 0.78, // 1 USD to GBP
};

export type CurrencyCode = 'USD' | 'INR' | 'EUR' | 'JPY' | 'GBP';

export const convertCurrency = (
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode
): number => {
  if (fromCurrency === toCurrency) {
    return amount;
  }
  
  // Convert to USD first if the source is not USD
  let valueInUsd = amount;
  if (fromCurrency !== 'USD') {
    const reverseRate = exchangeRates[`USD_${fromCurrency}`];
    valueInUsd = amount / reverseRate;
  }
  
  // Convert from USD to target currency
  if (toCurrency === 'USD') {
    return valueInUsd;
  }
  
  const rate = exchangeRates[`USD_${toCurrency}`];
  return valueInUsd * rate;
};

export const formatCurrency = (amount: number, currencyCode: CurrencyCode): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  });
  
  return formatter.format(amount);
};

export const getCurrencySymbol = (currencyCode: CurrencyCode): string => {
  switch (currencyCode) {
    case 'USD': return '$';
    case 'INR': return '₹';
    case 'EUR': return '€';
    case 'JPY': return '¥';
    case 'GBP': return '£';
    default: return '$';
  }
};
