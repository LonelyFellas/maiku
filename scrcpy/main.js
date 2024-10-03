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
      this.shell('input swipe 350 700 350 100 500');
    });

    // 下滑
    const swipeDownBtn = document.getElementById('swipe-down-btn');
    swipeDownBtn.addEventListener('click', () => {
      this.shell('input swipe 350 100 350 700 500');
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

    // 输入
    const inputBtn = document.getElementById('input-btn');
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

      if (this.inputActive) {
        window.adbApi.shell(this.urlParams.adbAddr, `am broadcast -a ADB_INPUT_TEXT --es msg "${addChar}"`);
      } else {
        window.adbApi.shell(this.urlParams.adbAddr, `input text "${addChar}"`);
      }
    };

    inputRef.focus();
    inputRef.onblur = () => {
      inputRef.focus();
    };
    inputBtn.onclick = () => {
      if (this.inputActive) {
        this.inputActive = false;
        inputBtn.classList.remove('active');
        window.adbApi.shell(this.urlParams.adbAddr, 'ime reset');
        window.ipcRenderer.send('set-adb-keyboard', this.urlParams.winName, 'close');
        inputRef.removeEventListener('compositionstart', handleComposition);
        inputRef.removeEventListener('compositionend', handleComposition);
      } else {
        this.inputActive = true;
        inputBtn.classList.add('active');
        window.adbApi.shell(this.urlParams.adbAddr, 'ime enable com.android.adbkeyboard/.AdbIME');
        window.adbApi.shell(this.urlParams.adbAddr, 'ime set com.android.adbkeyboard/.AdbIME');
        inputRef.addEventListener('compositionstart', handleComposition);
        inputRef.addEventListener('compositionend', handleComposition);
      }
      11;
    };
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
  window.ipcRenderer.send('install-adb-keyboard', params.winName);
});
