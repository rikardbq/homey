import { walk } from "@std/fs/walk";
import { define } from "../../utils.ts";

export const handler = define.handlers(async (_ctx) => {
	const files = await Array.fromAsync(walk(".", { maxDepth: 1 }));

	return new Response(JSON.stringify(files));
});
