![](./Mousecape-5%20(dragged).png)

# mousecape-from-windows-cursor

Converts Windows cursors (.cur, .ani) to macOS [Mousecape](https://github.com/alexzielenski/Mousecape) .cape files.

## Usage (Command line)

```zsh
npm install -G mousecape-from-windows-cursor
```
```zsh
mousecape-from-windows-cursor ./install.inf
```



## Usage (Node)

```ts
import { dirname, resolve } from "path";
import { buildMousecape, parseInstall, stringifyMousecape } from "mousecape-from-windows-cursor";
import { readFile, writeFile } from "fs/promises";

const installInfPath = "./windows-cursor/Install.inf";
const cursorsPath = dirname(installInfPath);


// parse install.inf
const install = parseInstall(await readFile(installInfPath, "utf8"));

// create { ["fileName.cur"]: { cursor: Buffer, animated?: boolean } } object
const cursors = await Promise.all(Object.entries(install)
    .filter(([e]) => !["CUR_DIR", "SCHEME_NAME"].includes(e))
    .map(
        async ([cursor, path]) => ([
            cursor, {
                animated: path.endsWith(".ani"),
                cursor: await readFile(resolve(cursorsPath, path))
            }] as [string, { cursor: Buffer, animated?: boolean }]
        )));

// create cape
const cape = await buildMousecape(Object.fromEntries(cursors), {
    author: "you",
    capeName: install.SCHEME_NAME
});

// and stringify it to plist
await writeFile(resolve(cursorsPath, `./${cape.id}.cape`), stringifyMousecape(cape))
```