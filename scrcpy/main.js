class ScrcpyUI {
  urlParams = {
    adbAddr: '',
    imgPort: '',
    winName: '',
  };
  rotationValue = -1;
  isComposingRef = false;
  inputValue = '';
  inputActive = false;
  constructor(rotateValue, urlParams) {
    this.urlParams = urlParams;
    this.rotationValue = rotateValue;
    document.title = this.urlParams.winName;
  }

  shell(cmd) {
    window.adbApi.shell(this.urlParams.adbAddr, cmd);
  }

  start() {
    // 旋转
    const rotateBtn = document.getElementById('rotate-btn');
    rotateBtn.addEventListener('click', () => {
      if (this.rotationValue === -1) return;
      window.ipcRenderer.send('set-resizebale-true-scrcpy-window', this.urlParams.winName);
      this.shell('settings put system accelerometer_rotations 0');

      this.rotationValue = this.rotationValue === 3 ? 0 : this.rotationValue + 1;
      this.shell(`settings put system user_rotation ${this.rotationValue}`);
    });
    // 截图
    const screenshotBtn = document.getElementById('screenshot-btn');
    screenshotBtn.addEventListener('click', () => {
      window.ipcRenderer.send('screenshot-scrcpy-window', this.urlParams.winName);
    });

    // 音量+
    const volumeUpBtn = document.getElementById('volume-up-btn');
    volumeUpBtn.addEventListener('click', () => {
      this.shell('input keyevent KEYCODE_VOLUME_UP');
    });

    // 音量-
    const volumeDownBtn = document.getElementById('volume-down-btn');
    volumeDownBtn.addEventListener('click', () => {
      this.shell('input keyevent KEYCODE_VOLUME_DOWN');
    });

    // 上滑
    const swipeUpBtn = document.getElementById('swipe-up-btn');
    swipeUpBtn.addEventListener('click', () => {
      this.shell('input keyevent KEYCODE_WAKEUP');
      if (this.rotationValue === 0 || this.rotationValue === 2) {
        this.shell('input swipe 360 1000 360 300');
      } else {
        this.shell('input swipe 1000 360 300 360');
      }
    });

    // 下滑
    const swipeDownBtn = document.getElementById('swipe-down-btn');
    swipeDownBtn.addEventListener('click', () => {
      if (this.rotationValue === 0 || this.rotationValue === 2) {
        this.shell('input swipe 360 300 360 1000');
      } else {
        this.shell('input swipe 300 360 1000 360');
      }
    });

    // 左滑
    const swipeLeftBtn = document.getElementById('swipe-left-btn');
    swipeLeftBtn.addEventListener('click', () => {
      this.shell('input swipe 600 350 100 350 100');
    });

    // 右滑
    const swipeRightBtn = document.getElementById('swipe-right-btn');
    swipeRightBtn.addEventListener('click', () => {
      this.shell('input swipe 100 350 600 350 100');
    });

    // 返回
    const backBtn = document.getElementById('back-btn');
    backBtn.addEventListener('click', () => {
      this.shell('input keyevent 4');
    });

    // 主页
    const homeBtn = document.getElementById('home-btn');
    homeBtn.addEventListener('click', () => {
      this.shell('input keyevent 3');
    });

    // 任务
    const recentBtn = document.getElementById('recent-btn');
    recentBtn.addEventListener('click', () => {
      this.shell('input keyevent 187');
    });

    const inputRef = document.getElementById('hide-input');
    const handleComposition = (e) => {
      if (e.type === 'compositionstart') {
        this.isComposingRef = true;
      } else if (e.type === 'compositionend') {
        this.isComposingRef = false;
        // 输入法结束组合时，手动调用 onChange 处理逻辑
        handleInputChange(e);
      }
    };
    const handleInputChange = (e) => {
      if (this.isComposingRef) {
        // 输入法正在组合字符，不触发逻辑
        return;
      }
      const currentValue = e.target.value;
      const addChar = currentValue.slice(this.inputValue.length);
      this.inputValue = currentValue;

      window.adbApi.shell(this.urlParams.adbAddr, `am broadcast -a ADB_INPUT_TEXT --es msg "${addChar}"`);
    };

    inputRef.focus();
    inputRef.onblur = () => {
      inputRef.focus();
    };

    inputRef.addEventListener('compositionstart', handleComposition);
    inputRef.addEventListener('compositionend', handleComposition);
    inputRef.oninput = handleInputChange;
    inputRef.onkeydown = (e) => {
      if (e.keyCode === 8) {
        this.inputValue = e.target.value;
        window.adbApi.shell(this.urlParams.adbAddr, 'input keyevent 67'); // 退格键
        return;
      }
    };
  }
}

// 获取url参数
const paramUrl = new URL(window.location.href);
const params = Object.fromEntries(paramUrl.searchParams.entries());
window.addEventListener('preload-ready', async () => {
  window.ipcRenderer.send('show-scrcpy-window', params.winName);
  const getRotateRes = await window.adbApi?.shellResult(params.adbAddr, 'dumpsys input | grep "SurfaceOrientation"');
  if (['SurfaceOrientation: 0', 'SurfaceOrientation: 1', 'SurfaceOrientation: 2', 'SurfaceOrientation: 3'].includes(getRotateRes.trim())) {
    const ui = new ScrcpyUI(parseInt(getRotateRes.trim().split(': ')[1]), params);
    ui.start();
  }
  window.ipcRenderer.invoke('install-adb-keyboard', params.winName).then(() => {
    window.adbApi.shell(this.urlParams.adbAddr, 'ime enable com.android.adbkeyboard/.AdbIME');
    window.adbApi.shell(this.urlParams.adbAddr, 'ime set com.android.adbkeyboard/.AdbIME');
  });
});
