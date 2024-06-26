/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-05 09:11:39
 * @ Modified time: 2024-07-01 02:46:55
 * @ Description:
 * 
 * This file contains the main process of the app.
 */

// Modules
const { app, BrowserWindow } = require('electron');

// Main subprocesses
const { FS } = require('./main/main.fs');
const { IPC } = require('./main/main.ipc');
const { Python } = require('./main/main.python');
const { Events } = require('./main/main.events');

/**
 * The main process code.
 */
const MAIN = (function() {

  const _ = {};
  let _mainWindow = null;

  // Handle creating/removing shortcuts on Windows when installing/uninstalling.
  if (require('electron-squirrel-startup'))
    app.quit();

  /**
   * Creates a new window.
   */
  _.createWindow = function() {
    
    // Create the browser window.
    _mainWindow = new BrowserWindow({

      // Kiosk mode basically
      frame: false,

      // Some other settings
      webPreferences: {
        contextIsolation: true,
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
    });

    // Load the index.html of the app.
    _mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    _mainWindow.maximize();
  };

  /**
   * Initializes the different app components.
   */
  _.init = function() {

    // Init the ipc
    IPC.init(_mainWindow);

    // Init the fs object
    FS.init(_mainWindow);

    // Set up the event registry
    Events.init();

    // Load the Python scripts
    Python.init();
  }

  /**
   * Gets called when Electron has finished initializing.
   * Creates a new browser window after the init.
   */
  app.whenReady().then(() => {
    
    // Create the window
    _.createWindow();

    // Init the app components
    _.init();

    // This is OSX behavior.
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0)
        _.createWindow();
    });
  });

  /**
   * When all windows are closed and this isn't OSX, then quit the app.
   * Again, OSX default behavior can have the app still running even when all windows are closed.
   */
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
      app.quit();
  });

  return {
    ..._,
  }
})();