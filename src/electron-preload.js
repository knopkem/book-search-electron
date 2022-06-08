// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer, screen } = require("electron");

// As an example, here we use the exposeInMainWorld API to expose the browsers
// and node versions to the main window.
// They'll be accessible at "window.ipcRenderer".
process.once("loaded", () => {
  contextBridge.exposeInMainWorld("ipcRenderer", ipcRenderer);
  contextBridge.exposeInMainWorld("escreen", screen);
  console.log(screen);
  console.log('preload ready');
});