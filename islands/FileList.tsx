import type { Signal } from "@preact/signals";
import { WalkEntry } from "@std/fs/walk";
import { useEffect } from "preact/hooks";
import { IS_BROWSER } from "fresh/runtime";

interface FileListProps {
	files: Signal<WalkEntry[] | undefined>;
}

export default function FileList(props: FileListProps) {
	useEffect(() => {
		(async () => {
			const res = await fetch("/api/files");
			props.files.value = await res.json();
		})();
	}, []);

	return !IS_BROWSER
		? (
			<div>
				<h1>LOADING</h1>
			</div>
		)
		: (
			<div>
				{props.files.value?.map((x, i) => (
					<p key={x.name + i}>{x.name}</p>
				))}
			</div>
		);
}
