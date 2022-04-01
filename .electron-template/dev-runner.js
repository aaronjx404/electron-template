process.env.NODE_ENV = 'development';

const chalk = require('chalk');
const electron = require('electron');
const rollup = require('rollup');
const { say } = require('cfonts');
const { spawn } = require('child_process');
const rollupOptions = require('./rollup.config')('dev');

const config = {
  dev: {
    chineseLog: false,
    removeElectronJunk: true,
  },
};

let electronProcess = null;
let manualRestart = false;

function logStats(proc, data) {
  let log = '';

  log += chalk.yellow.bold(`┏ ${proc} ${config.dev.chineseLog ? '编译过程' : 'Process'} ${new Array(19 - proc.length + 1).join('-')}`);
  log += '\n\n';

  if (typeof data === 'object') {
    data
      .toString({
        colors: true,
        chunks: false,
      })
      .split(/\r?\n/)
      .forEach((line) => {
        log += '  ' + line + '\n';
      });
  } else {
    log += `  ${data}\n`;
  }

  log += '\n' + chalk.yellow.bold(`┗ ${new Array(28 + 1).join('-')}`) + '\n';
  console.log(log);
}

function removeJunk(chunk) {
  if (config.dev.removeElectronJunk) {
    // Example: 2018-08-10 22:48:42.866 Electron[90311:4883863] *** WARNING: Textured window <AtomNSWindow: 0x7fb75f68a770>
    if (/\d+-\d+-\d+ \d+:\d+:\d+\.\d+ Electron(?: Helper)?\[\d+:\d+] /.test(chunk)) {
      return false;
    }

    // Example: [90789:0810/225804.894349:ERROR:CONSOLE(105)] "Uncaught (in promise) Error: Could not instantiate: ProductRegistryImpl.Registry", source: chrome-devtools://devtools/bundled/inspector.js (105)
    if (/\[\d+:\d+\/|\d+\.\d+:ERROR:CONSOLE\(\d+\)\]/.test(chunk)) {
      return false;
    }

    // Example: ALSA lib confmisc.c:767:(parse_card) cannot find card '0'
    if (/ALSA lib [a-z]+\.c:\d+:\([a-z_]+\)/.test(chunk)) {
      return false;
    }
  }

  return chunk;
}

function startMain() {
  return new Promise((resolve, reject) => {
    const watcher = rollup.watch(rollupOptions);
    watcher.on('change', (filename) => {
      // 主进程日志部分
      logStats(`${config.dev.chineseLog ? '主进程文件变更' : 'Main-FileChange'}`, filename);
    });
    watcher.on('event', (event) => {
      if (event.code === 'END') {
        if (electronProcess && electronProcess.kill) {
          manualRestart = true;
          process.kill(electronProcess.pid);
          electronProcess = null;
          startElectron();

          setTimeout(() => {
            manualRestart = false;
          }, 5000);
        }

        resolve();
      } else if (event.code === 'ERROR') {
        reject(event.error);
      }
    });
  });
}

function startElectron() {
  var args = ['--inspect=5858', rollupOptions.output.file];

  // detect yarn or npm and process commandline args accordingly
  if (process.env.npm_execpath.endsWith('yarn.js')) {
    args = args.concat(process.argv.slice(3));
  } else if (process.env.npm_execpath.endsWith('npm-cli.js')) {
    args = args.concat(process.argv.slice(2));
  }

  electronProcess = spawn(electron, args);

  electronProcess.stdout.on('data', (data) => {
    electronLog(removeJunk(data), 'blue');
  });
  electronProcess.stderr.on('data', (data) => {
    electronLog(removeJunk(data), 'red');
  });

  electronProcess.on('close', () => {
    if (!manualRestart) process.exit();
  });
}

function electronLog(data, color) {
  if (data) {
    let log = '';
    data = data.toString().split(/\r?\n/);
    data.forEach((line) => {
      log += `  ${line}\n`;
    });
    console.log(chalk[color].bold(`┏ ${config.dev.chineseLog ? '主程序日志' : 'Electron'} -------------------`) + '\n\n' + log + chalk[color].bold('┗ ----------------------------') + '\n');
  }
}

function greeting() {
  const cols = process.stdout.columns;
  let text = '';

  if (cols > 104) text = 'electron-template';
  else if (cols > 76) text = 'electron-|template';
  else text = false;

  if (text) {
    say(text, {
      colors: ['yellow'],
      font: 'simple3d',
      space: false,
    });
  } else console.log(chalk.yellow.bold('\n  electron-template'));
  console.log(chalk.blue(`${config.dev.chineseLog ? '  准备启动...' : '  getting ready...'}`) + '\n');
}

async function init() {
  greeting();

  try {
    await startMain();
    await startElectron();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

init();
