import { ipcMain as i, desktopCapturer as c, app as n, BrowserWindow as d } from "electron";
import { spawn as l } from "child_process";
import { fileURLToPath as h } from "url";
import e from "path";
const p = h(import.meta.url), r = e.dirname(p);
let t;
function u() {
  new d({
    width: 800,
    height: 600,
    webPreferences: {
      preload: e.join(r, "../dist-electron/preload.mjs"),
      // Preload-Skript einbinden
      contextIsolation: !0,
      nodeIntegration: !0
      // Ermöglicht Node.js APIs im Renderer
    }
  }).loadFile(e.join(r, "../dist/index.html"));
}
function w() {
  t = l("python", [e.join(r, "assistant.py")]), t.stdout.on("data", (o) => {
    console.log(`Python Output: ${o.toString()}`);
  }), t.stderr.on("data", (o) => {
    console.error(`Python Error: ${o.toString()}`);
  }), t.on("close", () => {
    console.log("Python Backend beendet.");
  });
}
i.on("to-python", (o, s) => {
  t ? (t.stdin.write(`${s}
`), t.stdout.once("data", (a) => {
    console.log(`One-Time Python Output: ${a.toString()}`);
  })) : console.error("Python process is not running.");
});
i.handle("start-screen-share", async () => {
  try {
    const o = await c.getSources({
      types: ["screen"],
      thumbnailSize: { width: 1920, height: 1080 }
    });
    if (o.length === 0)
      throw new Error("No screen sources found");
    return o[0].id;
  } catch (o) {
    throw console.error("Failed to start screen sharing:", o), o;
  }
});
i.on("stop-screen-share", () => {
  t && t.stdin.write(`STOP_SCREEN_SHARE
`);
});
n.whenReady().then(() => {
  w(), u();
});
n.on("window-all-closed", () => {
  t && t.kill(), process.platform !== "darwin" && n.quit();
});
