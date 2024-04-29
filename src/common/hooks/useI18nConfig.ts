import { useContext } from 'react';
import { I18nConfigContext } from '@common';
import dlv from '@darwish/utils-dlv';

export default function useI18nConfig(key = '') {
  const { config, setLanguage } = useContext(I18nConfigContext);

  return [
    key === '' && config.config !== null ? config : dlv(config, key),
    setLanguage,
  ];
}
