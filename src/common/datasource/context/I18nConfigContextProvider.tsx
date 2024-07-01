import React, { useEffect, useState } from 'react';
import { useLocalStorage } from '@darwish/hooks-core';
import { I18nConfigContext } from '@/common';

export function I18nConfigContextProvider(props: React.PropsWithChildren<object>) {
  const [config, setConfig] = useState<I18nConfig>({} as I18nConfig);
  const [language, setLanguage] = useLocalStorage<Common.Locale>('i18n', 'zh');
  useEffect(() => {
    import(language === 'zh' ? '/src/assets/messages/zh.json' : '/src/assets/messages/en.json').then((res) => {
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
