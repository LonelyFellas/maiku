import { createContext } from 'react';

export const I18nConfigContext = createContext<{
  config: I18nConfig;
  setLanguage: (lang: I18nConfig['lang']) => void;
}>({
  config: {} as I18nConfig,
  setLanguage: () => null,
});
