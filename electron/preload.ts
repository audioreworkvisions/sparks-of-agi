import { ipcRenderer, contextBridge } from 'electron';

// Expose APIs to the Renderer process via contextBridge
contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * Send a message to the main process (to Python)
   * @param message - The message to send
   */
  sendToPython: (message: string) => ipcRenderer.send('to-python', message),

  /**
   * Listen for messages from the main process (from Python)
   * @param callback - The callback to handle incoming data
   */
  onFromPython: (callback: (data: string) => void) => {
    ipcRenderer.on('from-python', (_, data) => callback(data));
  },

  /**
   * Clean up listeners for the specified channel to prevent memory leaks
   * @param channel - The channel to remove listeners from
   */
  removeListener: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  },

  /**
   * Start screen sharing and return the source ID
   * @returns Promise that resolves when screen sharing starts
   */
  startScreenShare: () => ipcRenderer.invoke('start-screen-share'),

  /**
   * Stop screen sharing
   */
  stopScreenShare: () => ipcRenderer.send('stop-screen-share'),

  /**
   * Listen for screen frame updates
   * @param callback - The callback to handle incoming frame data
   */
  onScreenFrame: (callback: (data: string) => void) => {
    ipcRenderer.on('screen-frame', (_, data) => callback(data));
  },
});
