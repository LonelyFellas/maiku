class ScrcpyUI {
  urlParams = {
    adbAddr: '',
    imgPort: '',
    winName: '',
  };
  rotationValue = -1;
  constructor(rotateValue, urlParams) {
    this.urlParams = urlParams;
    this.rotationValue = rotateValue;
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
  window.ipcRenderer.invoke('get-static-path', 'keyboard-apk-path').then((res) => {
    window.adbApi.shell(params.adbAddr, `install ${res}`);
  });
});
