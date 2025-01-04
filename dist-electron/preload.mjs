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
  },
  /**
   * Start screen sharing and return the source ID
   * @returns Promise that resolves when screen sharing starts
   */
  startScreenShare: () => electron.ipcRenderer.invoke("start-screen-share"),
  /**
   * Stop screen sharing
   */
  stopScreenShare: () => electron.ipcRenderer.send("stop-screen-share"),
  /**
   * Listen for screen frame updates
   * @param callback - The callback to handle incoming frame data
   */
  onScreenFrame: (callback) => {
    electron.ipcRenderer.on("screen-frame", (_, data) => callback(data));
  },
  /**
   * Get the current frame from the active stream (webcam or screen share)
   * @returns Promise that resolves with the base64 encoded frame
   */
  getCurrentFrame: () => electron.ipcRenderer.invoke("get-current-frame"),
  /**
   * Switch the active stream (webcam or screen share)
   * @param streamType - The type of stream to switch to
   */
  switchStream: (streamType) => electron.ipcRenderer.send("to-python", `SWITCH_STREAM:${streamType}`)
});
