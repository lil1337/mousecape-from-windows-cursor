#!/usr/bin/env node

import { buildMousecape } from "buildMousecape";
import { existsSync, readdirSync, statSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { parseInstall } from "parseInstall";
import { dirname, resolve } from "path";
import { stringifyMousecape } from "stringifyMousecape";

import { name, version } from "../package.json";
import { inspect } from "util";
import { compositeSharpFromAnimated } from "compositeSharpFromAnimated";
import { quickLookAt } from "quickLookAt";


function help(){
    console.error(
`Usage: ${name} [ path to install.inf ]
       ${name} [ path to install.inf ] [ optional: path where to save .cape ( - for stdout ) ]
       ${name} [ path to install.inf ] 
        
Options: 
  -h, --help
  
https://github.com/lil1337/mousecape-from-windows-cursor`
    ); 
}


async function build(installInfPath: string, mousecapePath?: string){


    const cursorsPath = dirname(installInfPath);

    const install = parseInstall(await readFile(installInfPath, "utf8"));

    const cursors = await Promise.all(Object.entries(install)
    .filter(([e]) => !["CUR_DIR", "SCHEME_NAME"].includes(e))
    .map(async ([cursor, path]) => ([cursor, {
        animated: path.endsWith(".ani"),
        cursor: await readFile(resolve(cursorsPath, path))
    }] as [string, {cursor: Buffer, animated?: boolean}])));
    

    const cape = await buildMousecape(Object.fromEntries(cursors), {
        author: "you", 
        capeName: install.SCHEME_NAME
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



(async function () {

    const args = process.argv.slice(2);

    let [from, to] = args.filter(e=>
        e == "-" || !e.startsWith("-")
    );



    if (args.length < 1 || args.includes("-h") || args.includes("--help") || !from) {
        help(); if (!args.includes("-h") && !args.includes("--help")) process.exit(1);
    }

   

    if (!existsSync(from)) {console.error(`No such file or directory: ${from}`); process.exit(1)}
    if (statSync(from).isDirectory()){
        from = readdirSync(from).find(e=>e.endsWith(".inf"));
        if (!from) {console.error(`No .inf file found in ${from}`); process.exit(1)}
    }

    const result = await build(from, to);
    if (typeof result === "string") {console.log(
        `Done! Your cape is saved to ${result}\n\nOpen Mousecape, click File -> Import cape, select the cape that just appeared and hit ⌘ + Enter`
    ); return process.exit(0)}
    
    



})().catch(e=>{
    console.error(inspect(e, {depth: null}));
    help(); process.exit(1);
});