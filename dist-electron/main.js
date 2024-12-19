import { ipcMain as a, app as e, BrowserWindow as l } from "electron";
import { spawn as d } from "child_process";
import { fileURLToPath as c } from "url";
import n from "path";
const p = c(import.meta.url), r = n.dirname(p);
let o;
function h() {
  new l({
    width: 800,
    height: 600,
    webPreferences: {
      preload: n.join(r, "../dist-electron/preload.mjs"),
      // Preload-Skript einbinden
      contextIsolation: !0,
      nodeIntegration: !0
      // Ermöglicht Node.js APIs im Renderer
    }
  }).loadFile(n.join(r, "../dist/index.html"));
}
function m() {
  o = d("python", [n.join(r, "assistant.py")]), o.stdout.on("data", (t) => {
    console.log(`Python Output: ${t.toString()}`);
  }), o.stderr.on("data", (t) => {
    console.error(`Python Error: ${t.toString()}`);
  }), o.on("close", () => {
    console.log("Python Backend beendet.");
  });
}
a.on("to-python", (t, i) => {
  o ? (o.stdin.write(`${i}
`), o.stdout.once("data", (s) => {
    console.log(`One-Time Python Output: ${s.toString()}`);
  })) : console.error("Python process is not running.");
});
e.whenReady().then(() => {
  m(), h();
});
e.on("window-all-closed", () => {
  o && o.kill(), process.platform !== "darwin" && e.quit();
});
