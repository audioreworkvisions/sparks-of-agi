import { ipcMain, app, BrowserWindow } from "electron";
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
    pythonProcess.stdout.once("data", (data) => {
      console.log(`One-Time Python Output: ${data.toString()}`);
    });
  } else {
    console.error("Python process is not running.");
  }
});
app.whenReady().then(() => {
  startPythonBackend();
  createWindow();
});
app.on("window-all-closed", () => {
  if (pythonProcess) pythonProcess.kill();
  if (process.platform !== "darwin") app.quit();
});
