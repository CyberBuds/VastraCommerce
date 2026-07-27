/**
 * Format a Date object or ISO string into a standard format.
 */
export function formatDate(date: Date | string | number | undefined, formatStr: 'full' | 'short' | 'time' | 'relative' = 'full'): string {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';

  if (formatStr === 'relative') {
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  if (formatStr === 'full') {
    options.hour = '2-digit';
    options.minute = '2-digit';
    options.second = '2-digit';
  } else if (formatStr === 'time') {
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  return d.toLocaleDateString('en-US', options);
}

/**
 * Format currency with dynamic ISO currency and locale.
 */
export function formatCurrency(amount: number | string | undefined, currency: string = 'USD', locale: string = 'en-US'): string {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (value === undefined || isNaN(value)) return '-';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format arbitrary numbers with digit grouping.
 */
export function formatNumber(num: number | string | undefined, decimalPlaces: number = 0, locale: string = 'en-US'): string {
  const value = typeof num === 'string' ? parseFloat(num) : num;
  if (value === undefined || isNaN(value)) return '0';

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value);
}

/**
 * Format international or national phone numbers.
 * Example: +12345678901 -> +1 (234) 567-8901
 */
export function formatPhone(phone: string | undefined): string {
  if (!phone) return '-';
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    const intlCode = match[1] ? '+1 ' : '';
    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
  }
  return phone;
}

/**
 * Format GST or Tax registration numbers.
 * Format standard 15-digit GSTIN (India): 22AAAAA0000A1Z5
 */
export function formatGST(gst: string | undefined): string {
  if (!gst) return '-';
  const cleaned = gst.toUpperCase().trim();
  if (cleaned.length === 15) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7, 11)} ${cleaned.slice(11, 12)} ${cleaned.slice(12, 13)} ${cleaned.slice(13)}`;
  }
  return cleaned;
}
