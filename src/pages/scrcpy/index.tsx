import IconRotary from '@img/rotary-phone.svg?react';
import ScreenShot from '@img/screen-shot.svg?react';
import Upload from '@img/upload.svg?react';
import VolumeDown from '@img/volume-down.svg?react';
import VolumeUp from '@img/volume-up.svg?react';
import SpeedUp from '@img/speed-up.svg?react';
import More from '@img/more.svg?react';
import Back from '@img/back.svg?react';
import MainMenu from '@img/main-menu.svg?react';
import AllPid from '@img/all-pid.svg?react';
import AppStore from '@img/app-store.svg?react';
import React, { useEffect, useRef } from 'react';

const sysBtns = ['返回', '主菜单', '所有app'];
const btns1 = [
  { icon: <IconRotary />, text: '旋转' },
  { icon: <ScreenShot />, text: '截屏' },
  { icon: <Upload />, text: '上传' },
  { icon: <VolumeDown />, text: '音量+' },
  { icon: <VolumeUp />, text: '音量-' },
  { icon: <SpeedUp />, text: '速度' },
  { icon: <More />, text: '更多' },
];
const btns2 = [
  { icon: <Back />, text: sysBtns[0] },
  { icon: <MainMenu />, text: sysBtns[1] },
  { icon: <AllPid />, text: sysBtns[2] },
];
const btns3 = [{ icon: <AppStore />, text: '应用' }];
export default function ScrcpyPage() {
  const inputValue = useRef('');
  const isComposingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
    window.adbApi.shell('59.63.189.48:34742', 'adb shell ime enable com.android.adbkeyboard/.AdbIME');
    window.adbApi.shell('59.63.189.48:34742', 'adb shell ime set com.android.adbkeyboard/.AdbIME');
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef.current]);
  const handleShell = (code: string) => {
    window.adbApi.shell('59.63.189.48:34742', `input keyevent ${code}`);
  };
  const handleGeneralBtnClick = (text: string) => {
    switch (text) {
      case '旋转':
        handleShell('270');
        break;
      case '截屏':
        handleShell('270');
        break;
      case '上传':
        handleShell('270');
        break;
      case '音量+':
        handleShell('KEYCODE_VOLUME_UP');
        break;
      case '音量-':
        handleShell('KEYCODE_VOLUME_DOWN');
        break;
      case '速度':
        handleShell('270');
        break;
      case '更多':
        handleShell('270');
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
    console.log(e.keyCode);
    if (e.keyCode === 8) {
      console.log('Enter Pressed');
      // 回车键
      inputValue.current = e.target.value;
      window.adbApi.shell('59.63.189.48:34742', 'input keyevent 67'); // 退格键
      return;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    if (isComposingRef.current) {
      // 输入法正在组合字符，不触发逻辑
      return;
    }
    const currentValue = e.target.value; // 当前的输入值
    const addedCharacters = currentValue.slice(inputValue.current.length); // 计算新增字符

    // console.log('Previous Value:');
    // console.log('Current Value:', currentValue);
    // console.log('Added Characters:', addedCharacters);

    inputValue.current = currentValue; // 更新当前值

    window.adbApi.shell('59.63.189.48:34742', `am broadcast -a ADB_INPUT_TEXT --es msg "${addedCharacters}"`);
  };
  return (
    <div className="w-screen h-screen bg-gray-200 flex justify-end">
      <div className="h-full flex flex-col justify-between gap-[0px] p-[5px] w-[60px] bg-bg_primary shadow-lg transition-all duration-300 ease-in-out cursor-pointer ">
        <div className="flex flex-col gap-0">
          {btns1.map((btn, index) => (
            <div onClick={() => handleGeneralBtnClick(btn.text)} key={index} className="group hover:bg-bg_secondary/70 hover:text-white size-[50px] flex flex-col all_flex rounded-md">
              {btn.icon}
              {btn.text}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-0">
          {btns2.map((btn, index) => (
            <div onClick={() => handleSystemBtnClick(btn.text)} key={index} className="group hover:bg-bg_secondary/70 hover:text-white size-[50px] flex flex-col all_flex rounded-md">
              {btn.icon}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-0">
          {btns3.map((btn, index) => (
            <div key={index} className="group hover:bg-bg_secondary/70 hover:text-white size-[50px] flex flex-col all_flex rounded-md">
              {btn.icon}
              {btn.text}
            </div>
          ))}
        </div>
      </div>
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
