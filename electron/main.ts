import { app, BrowserWindow, ipcMain } from 'electron';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let pythonProcess: any;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '../dist-electron/preload.mjs'), // Preload-Skript einbinden
      contextIsolation: true,
      nodeIntegration: true, // Ermöglicht Node.js APIs im Renderer
    },
  });

  win.loadFile(path.join(__dirname, '../dist/index.html')); // Vite-Output
}

// Starte Python-Backend
function startPythonBackend() {
  pythonProcess = spawn("python", [path.join(__dirname, "assistant.py")]);;

  pythonProcess.stdout.on('data', (data: Buffer) => {
    console.log(`Python Output: ${data.toString()}`);
  });

  pythonProcess.stderr.on('data', (data: Buffer) => {
    console.error(`Python Error: ${data.toString()}`);
  });

  pythonProcess.on('close', () => {
    console.log('Python Backend beendet.');
  });
}

// IPC-Kommunikation zwischen Renderer und Python-Prozess
ipcMain.on('to-python', (_, message) => {
  if (pythonProcess) {
    pythonProcess.stdin.write(`${message}\n`);
    pythonProcess.stdout.once('data', (data: Buffer) => {
      console.log(`One-Time Python Output: ${data.toString()}`);
    });
  } else {
    console.error('Python process is not running.');
  }
});

app.whenReady().then(() => {
  startPythonBackend(); // Python starten
  createWindow();
});

app.on('window-all-closed', () => {
  if (pythonProcess) pythonProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});
