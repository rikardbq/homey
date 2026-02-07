import { Webview } from "@webview/webview";

const serverEntry = new URL(`./compiled-entry.js`, import.meta.url);
const worker = new Worker(
  serverEntry.href,
  {
    type: "module",
  },
);

const webview = new Webview();
webview.navigate(`http://localhost:${Deno.env.get("PORT") || 8000}`);
webview.run();
worker.terminate();

