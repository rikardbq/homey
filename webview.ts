const serverEntry = new URL("./compiled-entry.js", import.meta.url);
const worker = new Worker(
	serverEntry.href,
	{
		type: "module",
	},
);

const hostname = Deno.env.get("HOSTNAME") || "http://localhost";
const hostport = Deno.env.get("PORT") || 8000;

const command = new Deno.Command("./cef-webview/win/minimal.exe", {
	args: ["--kiosk", `--url=${hostname}:${hostport}`],
});

const process = command.spawn();
const output = await process.output();
console.debug(output);
worker.terminate();
