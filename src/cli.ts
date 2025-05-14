#!/usr/bin/env node

import { buildMousecape } from "buildMousecape";
import { existsSync, mkdirSync, readdirSync, statSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { parseInstall } from "parseInstall";
import { basename, dirname, resolve } from "path";
import { stringifyMousecape } from "stringifyMousecape";

import { name, version } from "../package.json";
import { inspect } from "util";
import { compositeSharpFromAnimated } from "compositeSharpFromAnimated";
import { quickLookAt } from "quickLookAt";
import { buildCursor } from "buildCursor";


function help() {
    console.error(
        `Usage: ${name} [ path to install.inf ]
       ${name} [ path to install.inf ] [ optional: path where to save .cape ( - for stdout ) ]
       ${name} [ ... path to install.inf ] [ ... path to install.inf ] [ ... path to install.inf ] [ optional: directory where to save .cape's or - ] 

       ${name} -d | --dump [ path to .cur or .ani ]
       ${name} -d | --dump [ path to directory with multiple .cur or .ani ]
       ${name} -d | --dump [ path to directory with multiple .cur or .ani ] [ optional: dir where to save multiple .png ( - for stdout ) ]
       ${name} -d | --dump [ path to .cur or .ani ] [ optional: path where to save .png ( - for stdout ) ]
       ${name} -d | --dump [ ... path to .cur or .ani ] [ ... path to .cur or .ani ] [ ... path to .cur or .ani ] [ optional: - ]
        
Options: 
    -d, --dump           Only convert .cur or .ani to .png instead of creating a cape
    -h, --help

  
https://github.com/lil1337/mousecape-from-windows-cursor`
    );
}


async function build(installInfPath: string, mousecapePath?: string) {


    const cursorsPath = dirname(installInfPath);

    const install = parseInstall(await readFile(installInfPath, "utf8"));

    const cursors = await Promise.all(Object.entries(install)
        .filter(([e]) => e == e.toLowerCase())
        .map(async ([cursor, path]) => ([cursor, {
            animated: path.endsWith(".ani"),
            cursor: await readFile(resolve(cursorsPath, path))
        }] as [string, { cursor: Buffer, animated?: boolean }])));


    const cape = await buildMousecape(Object.fromEntries(cursors), {
        author: install.INF_Provider ?? "you",
        capeName: install.SCHEME_NAME ?? "Unnamed"
    });

    const stringified = stringifyMousecape(cape);

    if (mousecapePath == "-") return process.stdout.write(stringified);

    if (!mousecapePath) mousecapePath = cursorsPath;
    const finalMousecapePath = resolve(existsSync(mousecapePath) && statSync(mousecapePath).isDirectory() ?
        resolve(mousecapePath, `${cape.id}.cape`) :
        mousecapePath);

    await writeFile(finalMousecapePath, stringifyMousecape(cape));

    return finalMousecapePath;

}



async function dump(cursor: string, to: string) {

    const capeCursor = await buildCursor(await readFile(cursor), cursor.endsWith(".ani"));
    if (to == "-") return process.stdout.write(capeCursor.representations[0]);
    else await writeFile(to, capeCursor.representations[0]);

}


(async function () {

    const args = process.argv.slice(2);

    let from = args.filter(e =>
        e == "-" || !e.startsWith("-")
    );
    let to: string = undefined;
    if (from.length > 1 && 
        (!existsSync(from[from.length - 1]) || statSync(from[from.length - 1]).isDirectory() || from[from.length - 1] == "-")
    ) {
        to = from.pop();
    }



    if (args.length < 1 || args.includes("-h") || args.includes("--help") || !from) {
        help(); if (!args.includes("-h") && !args.includes("--help")) process.exit(1);
    }

    if (args.includes("-d") || args.includes("--dump")) {

        let filesToDump = [];

        let from0 = from[0];

        if (existsSync && statSync(from0).isDirectory()) {
            filesToDump = readdirSync(from0).filter(e => e.endsWith(".cur") || e.endsWith(".ani"))
                .map(e => resolve(from0, e));

            if (!filesToDump.length) { console.error(`No .cur or .ani files found in ${from}`); process.exit(1) }
        }
        else filesToDump = [...from];

        if (filesToDump.some(e => !e.endsWith(".cur") && !e.endsWith(".ani"))) {
            console.error(`${filesToDump.filter(e => !e.endsWith(".cur") || !e.endsWith(".ani"))} is not .cur or .ani`); process.exit(1)
        }

        if (to && !existsSync(to) && to !== "-" && filesToDump.length > 1) mkdirSync(to);
        const isToADirectory = to && existsSync(to) && statSync(to).isDirectory();

        if (filesToDump.length > 1 && to && !isToADirectory && to !== "-") {
            console.error(`Cannot convert multiple files to a single file: ${to}`); process.exit(1)
        }

        await Promise.all(filesToDump.map(f => {
            
            let finalTo = isToADirectory ? resolve(to, basename(f) + ".png") : to;

            if (!finalTo) finalTo = resolve(f + ".png");

            console.error(`${f}  ->  ${finalTo}`);

            return dump(f, finalTo);
        }));

        console.error("\nDone!");
        return process.exit(0);
    }

    if (from.length && to && !(existsSync(to) && statSync(to).isDirectory()) && to !== "-") {
        console.error("Cannot convert multiple files to a single file"); process.exit(1)
    }


    await Promise.all(from.map(async f => {
        if (!existsSync(f)) { console.error(`No such file or directory: ${f}`); process.exit(1) }
        if (statSync(f).isDirectory()) {
            f = readdirSync(f).find(e => e.endsWith(".inf"));
            if (!f) { console.error(`No .inf file found in ${f}`); process.exit(1) }
        }

        const result = await build(f, to);
        if (typeof result === "string") console.error(
            `Done! Your cape is saved to ${result}\n\nOpen Mousecape, click File -> Import cape, select the cape that just appeared and hit ⌘ + Enter`
        );
    }))

    return process.exit(0)
}





)().catch(e => {
    console.error(inspect(e, { depth: null }));
    help(); process.exit(1);
});