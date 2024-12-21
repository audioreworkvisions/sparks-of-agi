import { ipcMain as r, desktopCapturer as d, app as s, BrowserWindow as l } from "electron";
import { spawn as h } from "child_process";
import { fileURLToPath as p } from "url";
import o from "path";
const u = p(import.meta.url), i = o.dirname(u);
let t;
function m() {
  new l({
    width: 800,
    height: 600,
    webPreferences: {
      preload: o.join(i, "../dist-electron/preload.mjs"),
      // Preload-Skript einbinden
      contextIsolation: !0,
      nodeIntegration: !0
      // Ermöglicht Node.js APIs im Renderer
    }
  }).loadFile(o.join(i, "../dist/index.html"));
}
function w() {
  t = h("python", [o.join(i, "assistant.py")]), t.stdout.on("data", (e) => {
    console.log(`Python Output: ${e.toString()}`);
  }), t.stderr.on("data", (e) => {
    console.error(`Python Error: ${e.toString()}`);
  }), t.on("close", () => {
    console.log("Python Backend beendet.");
  });
}
r.on("to-python", (e, n) => {
  t ? t.stdin.write(`${n}
`) : console.error("Python process is not running.");
});
r.handle("start-screen-share", async () => {
  try {
    const e = await d.getSources({
      types: ["screen"],
      thumbnailSize: { width: 1920, height: 1080 }
    });
    if (e.length === 0)
      throw new Error("No screen sources found");
    return e[0].id;
  } catch (e) {
    throw console.error("Failed to start screen sharing:", e), e;
  }
});
r.on("stop-screen-share", () => {
  t && t.stdin.write(`STOP_SCREEN_SHARE
`);
});
r.handle("get-current-frame", async () => t ? new Promise((e) => {
  t.stdin.write(`GET_CURRENT_FRAME
`);
  const n = (c) => {
    const a = c.toString().trim();
    a.startsWith("FRAME:") && (t.stdout.removeListener("data", n), e(a.slice(6)));
  };
  t.stdout.on("data", n);
}) : null);
s.whenReady().then(() => {
  w(), m();
});
s.on("window-all-closed", () => {
  t && t.kill(), process.platform !== "darwin" && s.quit();
});
