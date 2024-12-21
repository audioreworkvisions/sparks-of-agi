import { ipcMain, desktopCapturer, app, BrowserWindow } from "electron";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let pythonProcess;
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "../dist-electron/preload.mjs"),
      // Preload-Skript einbinden
      contextIsolation: true,
      nodeIntegration: true
      // Ermöglicht Node.js APIs im Renderer
    }
  });
  win.loadFile(path.join(__dirname, "../dist/index.html"));
}
function startPythonBackend() {
  pythonProcess = spawn("python", [path.join(__dirname, "assistant.py")]);
  pythonProcess.stdout.on("data", (data) => {
    console.log(`Python Output: ${data.toString()}`);
  });
  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python Error: ${data.toString()}`);
  });
  pythonProcess.on("close", () => {
    console.log("Python Backend beendet.");
  });
}
ipcMain.on("to-python", (_, message) => {
  if (pythonProcess) {
    pythonProcess.stdin.write(`${message}
`);
  } else {
    console.error("Python process is not running.");
  }
});
ipcMain.handle("start-screen-share", async () => {
  try {
    const sources = await desktopCapturer.getSources({
      types: ["screen"],
      thumbnailSize: { width: 1920, height: 1080 }
    });
    if (sources.length === 0) {
      throw new Error("No screen sources found");
    }
    return sources[0].id;
  } catch (error) {
    console.error("Failed to start screen sharing:", error);
    throw error;
  }
});
ipcMain.on("stop-screen-share", () => {
  if (pythonProcess) {
    pythonProcess.stdin.write("STOP_SCREEN_SHARE\n");
  }
});
ipcMain.handle("get-current-frame", async () => {
  if (pythonProcess) {
    return new Promise((resolve) => {
      pythonProcess.stdin.write("GET_CURRENT_FRAME\n");
      const frameListener = (data) => {
        const response = data.toString().trim();
        if (response.startsWith("FRAME:")) {
          pythonProcess.stdout.removeListener("data", frameListener);
          resolve(response.slice(6));
        }
      };
      pythonProcess.stdout.on("data", frameListener);
    });
  }
  return null;
});
app.whenReady().then(() => {
  startPythonBackend();
  createWindow();
});
app.on("window-all-closed", () => {
  if (pythonProcess) pythonProcess.kill();
  if (process.platform !== "darwin") app.quit();
});
