import { useContext } from 'react';
import { I18nConfigContext } from '@common';
import dlv from '@darwish/utils-dlv';

export default function useI18nConfig<const T extends string>(
  key: T,
): [PathValue<I18nConfig, T>, (lang: I18nConfig['lang']) => void] {
  const { config, setLanguage } = useContext(I18nConfigContext);

  return [
    key === '' && config.config !== null ? config : dlv(config, key),
    setLanguage,
  ];
}
