### Notes to self

- Use Deno to bundle the UI as a standalone application that can run on startup
    - Use some SSR JSX-thingy for the UI
- Deno fs can discover folders and/or shortcuts in predefined folders
    - Applications can come in the form of on-device apps and websites
    - Shortcuts may come in various forms
        - Actual windows shortcuts
        - Some homebrewed format to support website/local app linkage
            - Need to add some way to open dialog box to manually find apps on the system so that the homebrewed format could work seamlessly and without hand written links
- If I feel like this even becomes useful I will add some simple installer to streamline the installation and usage

#### subprocesses
---
```typescript
const process = await new Deno.Command("C:\\Users\\rikardbq\\my\\apps\\MMCE_Win32\\MMCE_Win32.exe", { args: [] }).output();
```

#### @std/fs
---
```typescript
import { walk } from "@std/fs/walk";
const stuff = await Array.fromAsync(walk("."));
// [
//   {
//     path: ".",
//     name: ".",
//     isFile: false,
//     isDirectory: true,
//     isSymlink: false
//   },
//   {
//     path: "script.ts",
//     name: "script.ts",
//     isFile: true,
//     isDirectory: false,
//     isSymlink: false
//   },
//   {
//     path: "foo.ts",
//     name: "foo.ts",
//     isFile: true,
//     isDirectory: false,
//     isSymlink: false
//   },
// ]
```