import { createContext } from 'react';

export interface I18nConfigContextType {
  config: I18nConfig;
  setLanguage: (lang: (prev: Common.Locale) => Common.Locale) => void;
}

export const I18nConfigContext = createContext<I18nConfigContextType>({
  config: {} as I18nConfig,
  setLanguage: () => null,
});
