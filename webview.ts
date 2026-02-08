// import { WebUI } from "@webui/deno-webui";
import { Webview } from "@webview/webview";

const serverEntry = new URL("./compiled-entry.js", import.meta.url);
const worker = new Worker(
	serverEntry.href,
	{
		type: "module",
	},
);

const hostname = Deno.env.get("HOSTNAME") || "http://localhost";
const hostport = Deno.env.get("PORT") || 8000;

// const myWindow = new WebUI();

// myWindow.setKiosk(true);
// // await myWindow.show(`${hostname}:${hostport}`);
// myWindow.showWebView(`${hostname}:${hostport}`);
// myWindow.run(`
//     document.addEventListener("contextmenu", function (event) {
// 		event.preventDefault();
// 		return false;
// 	});
// `);

// await WebUI.wait();
// console.log("TEST");

const webview = new Webview();
webview.navigate(`${hostname}:${hostport}`);
webview.eval(`
    window.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    });`);
webview.run();
worker.terminate();
