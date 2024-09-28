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

  start() {
    console.log("111")
    // 旋转
    const rotateBtn = document.getElementById('rotate-btn');
    rotateBtn.addEventListener('click', () => {
      if (this.rotationValue === -1) return;
      console.log(this.rotationValue);
      console.log(this.urlParams.adbAddr);
      console.log(window.adbApi)
      window.adbApi.shellResult(this.urlParams.adbAddr, 'settings put system accelerometer_rotations 0').then((res) => {
        console.log('res', res)
      });
      this.rotationValue = this.rotationValue === 3 ? 0 : this.rotationValue + 1;
      window.adbApi.shellResult(this.urlParams.adbAddr, `settings put system user_rotation ${this.rotationValue}`).then((res1) => {
        console.log('res1', res1)
      }); // 向右旋转
    });

    // 音量+
    const volumeUpBtn = document.getElementById('volume-up-btn');
    volumeUpBtn.addEventListener('click', () => {
      console.log("11")
      window.adbApi.shell(this.urlParams.adbAddr, 'input keyevent 24')
    });

    // 音量-
    const volumeDownBtn = document.getElementById('volume-down-btn');
    volumeDownBtn.addEventListener('click', () => {
      console.log("22")
      window.adbApi.shell(this.urlParams.adbAddr, 'input keyevent 25');
    });


  }
}

// 获取url参数
const paramUrl = new URL(window.location.href);
const params = Object.fromEntries(paramUrl.searchParams.entries());
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    window.adbApi?.shellResult(params.adbAddr, 'dumpsys input | grep "SurfaceOrientation"').then((res) => {
      if (['SurfaceOrientation: 0', 'SurfaceOrientation: 1', 'SurfaceOrientation: 2', 'SurfaceOrientation: 3'].includes(res.trim())) {
        const ui = new ScrcpyUI(parseInt(res.trim().split(': ')[1]), params);
        ui.start();
      }
    });
  }, 2000)
})


