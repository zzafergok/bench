'use client';

import { createContext, useContext } from 'react';
import type { Locale } from '@/i18n/routing';

export type { Locale };

const LocaleContext = createContext<Locale>('tr');

export function useCurrentLocale() {
  return useContext(LocaleContext);
}

export function ClientLocaleProvider({
  children,
  initialLocale = 'tr',
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  return <LocaleContext.Provider value={initialLocale}>{children}</LocaleContext.Provider>;
}
