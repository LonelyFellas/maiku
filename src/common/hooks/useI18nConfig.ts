import { useContext } from 'react';
import { I18nConfigContext, type I18nConfigContextType } from '@common';
import dlv from '@darwish/utils-dlv';

/**
 * 这是一个修改国际化配置和获取国家化文本的hooks
 * @param key 这个是是语言配置json的路径，比如：`config.login.title`
 */
export default function useI18nConfig<const T extends string | null = null>(
  key?: T,
): [PathValue<I18nConfig, T>, I18nConfigContextType['setLanguage']] {
  const { config, setLanguage } = useContext(I18nConfigContext);
  key = (key || '') as NonNullable<T>;
  return [
    key === '' && config.config !== null ? config : dlv(config, key),
    setLanguage,
  ];
}
