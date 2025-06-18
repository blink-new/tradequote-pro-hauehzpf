/**
 * UK-specific utility functions for TradeQuote Pro
 * Handles currency, addresses, phone numbers, VAT, and compliance
 */

// UK Currency formatting
export const formatGBP = (amount: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// UK Phone number validation and formatting
export const formatUKPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Handle different UK number formats
  if (cleaned.startsWith('44')) {
    // International format +44
    const national = cleaned.substring(2);
    if (national.startsWith('7')) {
      // Mobile: +44 7xxx xxx xxx
      return `+44 ${national.substring(0, 4)} ${national.substring(4, 7)} ${national.substring(7)}`;
    } else if (national.startsWith('20') || national.startsWith('21')) {
      // London: +44 20 xxxx xxxx
      return `+44 ${national.substring(0, 2)} ${national.substring(2, 6)} ${national.substring(6)}`;
    } else {
      // Other UK numbers: +44 xxxx xxx xxx
      return `+44 ${national.substring(0, 4)} ${national.substring(4, 7)} ${national.substring(7)}`;
    }
  } else if (cleaned.startsWith('0')) {
    // National format
    if (cleaned.startsWith('07')) {
      // Mobile: 07xxx xxx xxx
      return `${cleaned.substring(0, 5)} ${cleaned.substring(5, 8)} ${cleaned.substring(8)}`;
    } else if (cleaned.startsWith('020') || cleaned.startsWith('021')) {
      // London: 020 xxxx xxxx
      return `${cleaned.substring(0, 3)} ${cleaned.substring(3, 7)} ${cleaned.substring(7)}`;
    } else {
      // Other: 01xxx xxx xxx
      return `${cleaned.substring(0, 5)} ${cleaned.substring(5, 8)} ${cleaned.substring(8)}`;
    }
  }
  
  return phone; // Return original if no pattern matches
};

// UK Postcode validation
export const validateUKPostcode = (postcode: string): boolean => {
  const ukPostcodeRegex = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}$/i;
  return ukPostcodeRegex.test(postcode.replace(/\s/g, ''));
};

// Format UK postcode
export const formatUKPostcode = (postcode: string): string => {
  const cleaned = postcode.replace(/\s/g, '').toUpperCase();
  if (cleaned.length >= 5) {
    const outward = cleaned.slice(0, -3);
    const inward = cleaned.slice(-3);
    return `${outward} ${inward}`;
  }
  return postcode.toUpperCase();
};

// VAT calculation utilities
export interface VATCalculation {
  subtotal: number;
  vatAmount: number;
  vatRate: number;
  total: number;
}

export const calculateVAT = (subtotal: number, vatRate: number = 20): VATCalculation => {
  const vatAmount = (subtotal * vatRate) / 100;
  const total = subtotal + vatAmount;
  
  return {
    subtotal,
    vatAmount,
    vatRate,
    total,
  };
};

// UK date formatting
export const formatUKDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// UK business address validation
export interface UKAddress {
  line1: string;
  line2?: string;
  city: string;
  county?: string;
  postcode: string;
  country: string;
}

export const formatUKAddress = (address: UKAddress): string => {
  const lines = [
    address.line1,
    address.line2,
    address.city,
    address.county,
    formatUKPostcode(address.postcode),
    address.country || 'United Kingdom'
  ].filter(Boolean);
  
  return lines.join('\n');
};

// UK trade-specific utilities
export const UK_TRADE_CATEGORIES = {
  electrical: {
    name: 'Electrical',
    regulations: ['Part P', 'BS 7671', 'NICEIC/NAPIT'],
    vatRate: 20,
  },
  plumbing: {
    name: 'Plumbing & Heating',
    regulations: ['Gas Safe (if applicable)', 'Water Regulations'],
    vatRate: 20,
  },
  construction: {
    name: 'Construction',
    regulations: ['Building Regulations', 'CDM Regulations'],
    vatRate: 20,
    cisApplicable: true,
  },
  roofing: {
    name: 'Roofing',
    regulations: ['Building Regulations', 'Working at Height Regulations'],
    vatRate: 20,
  },
  carpentry: {
    name: 'Carpentry & Joinery',
    regulations: ['Building Regulations (structural work)'],
    vatRate: 20,
  },
};

// CIS (Construction Industry Scheme) calculation
export const calculateCISDeduction = (laborCost: number, cisRate: number = 20): number => {
  return laborCost * (cisRate / 100);
};

// UK material suppliers data
export const UK_SUPPLIERS = {
  electrical: ['CEF', 'Rexel', 'Edmundson Electrical', 'TLC Electrical'],
  plumbing: ['Plumb Center', 'City Plumbing', 'Travis Perkins', 'Wickes'],
  general: ['Screwfix', 'Toolstation', 'B&Q Trade Point', 'Selco'],
  trade: ['Travis Perkins', 'Jewson', 'Buildbase', 'Covers Timber & Builders Merchants'],
};

// Professional certifications and compliance
export const UK_CERTIFICATIONS = {
  electrical: [
    'NICEIC Approved Contractor',
    'NAPIT Registered',
    'ECA Member',
    'SELECT Approved (Scotland)',
  ],
  gas: [
    'Gas Safe Registered',
    'OFTEC Registered (Oil)',
  ],
  construction: [
    'CHAS Accredited',
    'Constructionline Gold',
    'SafeContractor Approved',
    'CSCS Card Holder',
  ],
};

// UK bank details validation
export const validateUKSortCode = (sortCode: string): boolean => {
  const cleaned = sortCode.replace(/[-\s]/g, '');
  return /^\d{6}$/.test(cleaned);
};

export const formatUKSortCode = (sortCode: string): string => {
  const cleaned = sortCode.replace(/[-\s]/g, '');
  if (cleaned.length === 6) {
    return `${cleaned.substring(0, 2)}-${cleaned.substring(2, 4)}-${cleaned.substring(4, 6)}`;
  }
  return sortCode;
};

export const validateUKAccountNumber = (accountNumber: string): boolean => {
  const cleaned = accountNumber.replace(/\s/g, '');
  return /^\d{8}$/.test(cleaned);
};