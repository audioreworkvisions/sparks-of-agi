interface ElectronAPI {
  onFromPython: (callback: (imageData: string) => void) => void;
  removeListener: (channel: string) => void;
}

declare interface Window {
  electronAPI: ElectronAPI;
}
