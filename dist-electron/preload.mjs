"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  /**
   * Send a message to the main process (to Python)
   * @param message - The message to send
   */
  sendToPython: (message) => electron.ipcRenderer.send("to-python", message),
  /**
   * Listen for messages from the main process (from Python)
   * @param callback - The callback to handle incoming data
   */
  onFromPython: (callback) => {
    electron.ipcRenderer.on("from-python", (_, data) => callback(data));
  },
  /**
   * Clean up listeners for the specified channel to prevent memory leaks
   * @param channel - The channel to remove listeners from
   */
  removeListener: (channel) => {
    electron.ipcRenderer.removeAllListeners(channel);
  }
});
