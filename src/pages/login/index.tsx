import { useState } from 'react';
import { BgWrapper as Wrapper, useI18nConfig, cn } from '@common';
import MainLogin from './modules/login';
import MainRegister from './modules/register';
import MainVerify from './modules/verify';

export interface LoginProps {
  handleChangeModuleType: (type: string) => void;
}

export default function Login() {
  const [lang] = useI18nConfig('config.login');
  const modulesConfig = {
    login: {
      title: lang?.login.btn_title,
      mainTitle1: lang?.login.main_title1,
      mainTitle2: lang?.login.main_title2,
      view: MainLogin,
    },
    register: {
      title: lang?.register.btn_title,
      mainTitle1: lang?.register.main_title1,
      mainTitle2: lang?.register.main_title2,
      view: MainRegister,
    },
    verify: {
      title: lang?.verify.btn_title,
      mainTitle1: lang?.verify.main_title1,
      mainTitle2: lang?.verify.main_title2,
      view: MainVerify,
    },
  };
  type ModuleType = keyof typeof modulesConfig;
  const [moduleType, setModuleType] = useState<ModuleType>('login');
  const Config = modulesConfig[moduleType];

  const handleChangeModuleType = (type: ModuleType) => setModuleType(type);
  return (
    <Wrapper className="flex justify-center pt-[8%] h-full relative z-2">
      <main className="w-[600px] h-[500px] text-center">
        <header>
          <span>{Config.mainTitle1}</span>
          <span className="text-text_primary cursor-pointer hover:text-text_primary/80" onClick={() => setModuleType((prev) => (prev === 'login' ? 'register' : 'login'))}>
            {Config.mainTitle2}
          </span>
        </header>
        <div
          className={cn('bg-white mx-10 mt-3 px-10 py-8 rounded-xl text-left', {
            'pb-20': moduleType === 'login',
          })}
        >
          {/* @ts-ignore */}
          <Config.view handleChangeModuleType={handleChangeModuleType} />
        </div>
      </main>
    </Wrapper>
  );
}
