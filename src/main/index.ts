import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import test from './test';

test();

function onAppReady() {
  const win = new BrowserWindow({ width: 1350, height: 830 });
  win.loadURL(`file://${join(__dirname, '..', 'src/renderer', 'index.html')}`);
  win.once('ready-to-show', () => {
    win.show();
    // 开发模式下自动开启devtools
    // if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools({ mode: 'undocked', activate: true });
    // }
  });
}

app.whenReady().then(onAppReady);

// 由于9.x版本问题，需要加入该配置关闭跨域问题
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');

app.on('window-all-closed', () => {
  // 所有平台均为所有窗口关闭就退出软件
  app.quit();
});
app.on('browser-window-created', () => {
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
