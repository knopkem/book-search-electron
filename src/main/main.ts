/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import * as fs from 'fs';
import { parse, stringify } from 'csv';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import fetch from 'electron-fetch';
import settings from 'electron-settings';

function getUserDoc() {
  return process.env.NODE_ENV === 'production'
    ? `${process.env.USERPROFILE}\\Documents`
    : '.';
}

const csvName = 'books.csv';
const csvPath = `${getUserDoc()}\\${csvName}`;
let lastData = 'unknown';

const readCSV = async () => {
  return new Promise((resolve, reject) => {
    const parser = parse({ columns: true }, (_err, records) => {
      if (_err) {
        reject(_err);
      }
      const mapped = records.map((row, index) => ({
        id: index,
        ...row,
      }));
      resolve(mapped);
    });

    fs.createReadStream(csvPath).pipe(parser);
  }).catch((e) => {
    console.error(e);
    return [];
  });
};

const readSettings = async () => {
  const url = (await settings.get('cloud.url')) as string;
  const token = (await settings.get('cloud.token')) as string;
  return {
    url,
    token
  }
}

const postToCloud = async (data) => {
  const {url, token} =  await readSettings();

  if (!url || !token) return;
  console.log(`synching to ${url}`);

  fetch(url + '/books', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((e) => mainWindow?.webContents.send('sync-failure'),);
};

const writeCSV = async (data) => {
  const dataStr = JSON.stringify(data);
  if (dataStr === lastData) return
  await stringify(data).pipe(fs.createWriteStream(csvPath));
  lastData = dataStr;
  return postToCloud(data);
};

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('save-settings', async (_event, _arg) => {
  await settings.set('cloud', {
    ..._arg,
  });
});

ipcMain.on('update-selection', async (_event, _arg) => {
  writeCSV(_arg);
});

ipcMain.handle('get-data', async () => {
  return readCSV();
});

ipcMain.handle('read-settings', async () => {
  console.log('reading settings');
  return readSettings();
});


if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1900,
    height: 1000,
    icon: getAssetPath('icon.png'),
    autoHideMenuBar: false,
    webPreferences: {
      spellcheck: false,
      devTools: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
