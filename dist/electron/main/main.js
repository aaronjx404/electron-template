'use strict';

var electron = require('electron');
var path = require('path');

function onAppReady() {
  const win = new electron.BrowserWindow({ width: 1350, height: 830 });
  win.loadURL(`file://${path.join(__dirname, '..', 'renderer', 'index.html')}`);
  win.once('ready-to-show', () => {
    win.show();
    // 开发模式下自动开启devtools
    // if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools({ mode: 'undocked', activate: true });
    // }
  });
}

electron.app.whenReady().then(onAppReady);

// 由于9.x版本问题，需要加入该配置关闭跨域问题
electron.app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');

electron.app.on('window-all-closed', () => {
  // 所有平台均为所有窗口关闭就退出软件
  electron.app.quit();
});
electron.app.on('browser-window-created', () => {
  console.log('window-created');
});

// if (process.defaultApp) {
//   if (process.argv.length >= 2) {
//     app.removeAsDefaultProtocolClient('electron-vue-template')
//     console.log('由于框架特殊性开发环境下无法使用')
//   }
// } else {
//   app.setAsDefaultProtocolClient('electron-vue-template')
// }
