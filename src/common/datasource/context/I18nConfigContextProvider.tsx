import { useLocalStorage } from '@darwish/hooks-core';
import React, { createContext, useEffect, useState } from 'react';

const DEFAULT_CONFIG: I18nConfig = {
  lang: '简体中文',
  config: {
    metadata: {
      basic: {
        title: '',
        description: ''
      }
    }
  },
};
export const I18nConfigContext = createContext<{
  config: I18nConfig;
  setLanguage: (lang: I18nConfig['lang']) => void;
}>({
  config: DEFAULT_CONFIG,
  setLanguage: () => null,
});

export function I18nConfigContextProvider(
  props: React.PropsWithChildren<object>,
) {
  const [config, setConfig] = useState<I18nConfig>(DEFAULT_CONFIG);
  const [language, setLanguage] = useLocalStorage('i18n', 'zh');

  useEffect(() => {
    import(
      language === 'zh'
        ? '/src/assets/messages/zh.json'
        : '/src/assets/messages/en.json'
    ).then((res) => {
      setConfig({
        lang: language === 'zh' ? '简体中文' : 'English',
        config: res.default,
      });
    });
  }, [language]);
  return (
    <I18nConfigContext.Provider
      value={{
        config,
        setLanguage,
      }}
      children={props.children}
    />
  );
}
