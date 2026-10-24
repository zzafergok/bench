export const locales = ['tr', 'en'] as const;
export type Locale = (typeof locales)[number];

export const BCP47_LOCALES: Record<Locale, string> = {
  tr: 'tr-TR',
  en: 'en-US',
} as const;

export const routing = {
  locales,
  defaultLocale: 'en' satisfies Locale,
  localePrefix: 'never',
} as const;

const localeSet = new Set<Locale>(locales);

export function normalizeLocale(value: unknown): Locale | null {
  if (typeof value !== 'string') return null;
  return localeSet.has(value as Locale) ? (value as Locale) : null;
}

export function toBCP47Locale(value?: unknown): string {
  if (typeof value === 'string' && value.includes('-')) {
    return value;
  }
  const normalized = normalizeLocale(value);
  return BCP47_LOCALES[normalized ?? routing.defaultLocale];
}
