import { ArrowUpOutlined, ArrowDownOutlined, ArrowLeftOutlined, ArrowRightOutlined, QuestionCircleOutlined, TranslationOutlined } from '@ant-design/icons';
import IconRotary from '@img/rotary-phone.svg?react';
import ScreenShot from '@img/screen-shot.svg?react';
import VolumeDown from '@img/volume-down.svg?react';
import VolumeUp from '@img/volume-up.svg?react';
import Back from '@img/back.svg?react';
import MainMenu from '@img/main-menu.svg?react';
import AllPid from '@img/all-pid.svg?react';
import React, { useEffect, useRef } from 'react';
import { Scrollbar } from '@darwish/scrollbar-react';
// import { Svg } from '/src/common';

const sysBtns = ['返回', '主菜单', '所有app'];
const btns1 = [
  { icon: <IconRotary />, text: 'rotate', label: '旋转' },
  { icon: <ScreenShot />, text: 'screen_shot', label: '截屏' },
  // { icon: <Upload />, text: 'upload', label: '上传' },
  { icon: <VolumeDown />, text: 'volume_down', label: '音量' },
  { icon: <VolumeUp />, text: 'volume_up', label: '音量' },
  // { icon: <SpeedUp />, text: 'speed_up', label: '速度' },
  { icon: <QuestionCircleOutlined />, text: 'embed', label: '嵌入' },
  { icon: <ArrowUpOutlined />, text: 'arrow_up', label: '上滑' },
  { icon: <ArrowDownOutlined />, text: 'arrow_down', label: '下滑' },
  { icon: <ArrowLeftOutlined />, text: 'arrow_left', label: '左滑' },
  { icon: <ArrowRightOutlined />, text: 'arrow_right', label: '右滑' },
  { icon: <TranslationOutlined />, text: 'input', label: '输入' },
  // { icon: <Svg.shurufa className="size-[14px]" />, text: <span className="text-[12px]">输入法</span> },
  // { icon: <More />, text: '重启' },
  // { icon: <More />, text: '关机' },
  // { icon: <More />, text: '重置' },
  // { icon: <More />, text: '息屏' },
  // { icon: <More />, text: 'ADB' },
];
const btns2 = [
  { icon: <Back />, text: sysBtns[0] },
  { icon: <MainMenu />, text: sysBtns[1] },
  { icon: <AllPid />, text: sysBtns[2] },
];
// const btns3 = [{ icon: <AppStore />, text: '应用' }];
export default function ScrcpyPage() {
  const inputValue = useRef('');
  const isComposingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const rotation = useRef(0);
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const winName = params.get('win_name') ?? '闪电云手机';
  const adbAddr = params.get('adbAddr') ?? '59.63.189.48:34742';

  const handleComposition = (event: React.CompositionEvent<HTMLInputElement>) => {
    if (event.type === 'compositionstart') {
      isComposingRef.current = true;
    } else if (event.type === 'compositionend') {
      isComposingRef.current = false;
      // 输入法结束组合时，手动调用 onChange 处理逻辑
      handleInputChange(event as unknown as React.ChangeEvent<HTMLInputElement>);
    }
  };
  useEffect(() => {
    /**
     * SurfaceOrientation:
     * 0：设备处于 竖屏模式，无旋转。
     * 1：屏幕 顺时针旋转 90 度，处于 横屏模式。
     * 2：屏幕 顺时针旋转 180 度，处于 倒置竖屏模式。
     * 3：屏幕 顺时针旋转 270 度，处于 倒置横屏模式。
     * */
    window.adbApi.shellResult(adbAddr, 'dumpsys input | grep "SurfaceOrientation"').then((res) => {
      if (['SurfaceOrientation: 0', 'SurfaceOrientation: 1', 'SurfaceOrientation: 2', 'SurfaceOrientation: 3'].includes(res.trim())) {
        rotation.current = parseInt(res.trim().split(': ')[1]);
        console.log('rotation', rotation.current);
        // if (rotation.current === 0 || rotation.current === 1) {
        //   window.ipcRenderer.send('scrcpy:init-size-window', { winName, direction: 'horizontal' });
        // }
      }
    });
    document.title = winName;
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef.current]);
  const handleShell = (code: string) => {
    window.adbApi.shell(adbAddr, `input keyevent ${code}`);
  };
  const handleGeneralBtnClick = async (text: string) => {
    switch (text) {
      case 'rotate':
        window.adbApi.shell(adbAddr, 'settings put system accelerometer_rotations 0');
        rotation.current = rotation.current === 3 ? 0 : rotation.current + 1;
        window.adbApi.shell(adbAddr, `settings put system user_rotation ${rotation.current}`); // 向右旋转
        // window.ipcRenderer.send('scrcpy:rotate-screen', { winName, direction: rotation.current === 1 || rotation.current === 3 ? 'horizontal' : 'vertical' });
        break;
      case 'screen_shot':
        window.ipcRenderer.send('scrcpy:screen-shot', { type: 'open', winName });
        break;
      case 'upload':
        handleShell('270');
        break;
      case 'volume_up':
        handleShell('KEYCODE_VOLUME_UP');
        break;
      case 'volume_down':
        handleShell('KEYCODE_VOLUME_DOWN');
        break;
      // case 'embed':
      //   handleShell('270');
      //   break;
      case 'embed':
        window.ipcRenderer.send('scrcpy:reembed-window', winName);
        break;
      case 'arrow_up':
        window.adbApi.shell(adbAddr, 'input keyevent KEYCODE_WAKEUP');
        window.adbApi.shell(adbAddr, 'input swipe 540 1600 540 400 300');
        break;
      case 'arrow_down':
        window.adbApi.shell(adbAddr, 'input swipe 540 400 540 1600 500');
        break;
      case 'arrow_left':
        window.adbApi.shell(adbAddr, 'input swipe 600 960 100 960 100');
        break;
      case 'arrow_right':
        window.adbApi.shell(adbAddr, 'input swipe 200 960 900 960 100');
        break;
      case 'input':
        const isInstall = await window.ipcRenderer.invoke('scrcpy:adb-keyboard', adbAddr);
        console.log('isInstall', isInstall);
        if (isInstall) {
          window.adbApi.shell(adbAddr, 'ime enable com.android.adbkeyboard/.AdbIME');
          window.adbApi.shell(adbAddr, 'ime set com.android.adbkeyboard/.AdbIME');
        }
        break;
    }
  };

  const handleSystemBtnClick = (text: string) => {
    switch (text) {
      case '返回':
        handleShell('3');
        break;
      case '主菜单':
        handleShell('3');
        break;
      case '所有app':
        handleShell('187');
        break;
    }
  };
  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement> & { target: HTMLInputElement }) => {
    if (e.keyCode === 8) {
      // 回车键
      inputValue.current = e.target.value;
      window.adbApi.shell(adbAddr, 'input keyevent 67'); // 退格键
      return;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isComposingRef.current) {
      // 输入法正在组合字符，不触发逻辑
      return;
    }
    const currentValue = e.target.value; // 当前的输入值
    const addedCharacters = currentValue.slice(inputValue.current.length); // 计算新增字符

    inputValue.current = currentValue; // 更新当前值

    window.adbApi.shell(adbAddr, `am broadcast -a ADB_INPUT_TEXT --es msg "${addedCharacters}"`);
  };
  return (
    <div className="w-screen h-screen bg-gray-200 flex justify-end overflow-hidden">
      <Scrollbar className="h-full flex flex-col justify-between gap-[0px] p-[5px] w-[60px] bg-bg_primary shadow-lg transition-all duration-300 ease-in-out cursor-pointer overflow-x-hidden overflow-y-auto">
        <div className="flex flex-col gap-0">
          {btns1.map((btn, index) => (
            <div onClick={() => handleGeneralBtnClick(btn.text)} key={index} className="group text-[14px] hover:bg-bg_secondary/70 hover:text-white w-[50px] h-[30px] all_flex rounded-md">
              {btn.icon}
              {btn.label}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-0">
          {btns2.map((btn, index) => (
            <div onClick={() => handleSystemBtnClick(btn.text)} key={index} className="group hover:bg-bg_secondary/70 hover:text-white w-[50px] h-[30px] all_flex rounded-md">
              {btn.icon}
            </div>
          ))}
        </div>
        {/* <div className="flex flex-col gap-0">
          {btns3.map((btn, index) => (
            <div key={index} className="group text-[14px] hover:bg-bg_secondary/70 hover:text-white w-[50px] h-[30px] all_flex rounded-md">
              {btn.icon}
              {btn.label ?? btn.text}
            </div>
          ))}
        </div> */}
      </Scrollbar>
      <div className="absolute bottom-[5px] left-0 opacity-0">
        <input
          ref={inputRef}
          onBlur={() => {
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }}
          onCompositionStart={handleComposition}
          onCompositionUpdate={handleComposition}
          onCompositionEnd={handleComposition}
          onKeyDown={handleKeydown}
          onChange={(e) => handleInputChange(e)}
          placeholder="输入指令"
        />
      </div>
    </div>
  );
}
