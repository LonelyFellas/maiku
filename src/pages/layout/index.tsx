import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import { BgWrapper, useI18nConfig } from '@common';
import Body from './modules/body';
import Header from './modules/header';
import Slider from './modules/slider';

export default function Layout() {
  const [lang] = useI18nConfig();

  return (
    <ConfigProvider
      locale={lang?.lang === '简体中文' ? zhCN : enUS}
      theme={{
        components: {
          Table: {
            headerBg: '#d3e3fd',
          },
        },
        token: {
          colorPrimary: '#1e4dff',
        },
      }}
    >
      <BgWrapper className="flex h-full">
        <Slider />
        <div className="flex flex-col w-full h-full p-4 relative z-2 flex-1 overflow-hidden">
          <Header />
          <Body />
        </div>
      </BgWrapper>
    </ConfigProvider>
  );
}
