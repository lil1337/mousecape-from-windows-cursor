import { spawn } from "child_process";
import { randomUUID } from "crypto";
import { unlink, writeFile } from "fs/promises";
import { tmpdir } from "os"
import { resolve } from "path";

export async function quickLookAt(at: Uint8Array | string, ext: string = "png") {
    const tmpPath = resolve(tmpdir(), randomUUID()+"."+ext);
    if (typeof at !== "string") await writeFile(tmpPath, Buffer.from(at));

    const qlmanage = spawn("/usr/bin/qlmanage", ["-p", typeof at === "string" ? at : tmpPath]);
    qlmanage.stderr.on("data", (data) => process.stderr.write(data));

    return new Promise<void>((resolve, reject) => {
        qlmanage.on("close", (code) => {
            if (typeof at !== "string") unlink(tmpPath);
            code === 0 ? resolve() : reject();
        });
    });
}