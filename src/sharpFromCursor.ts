import sharp from "sharp";
import WindowsCursorParser from "./WinCursorParser";
import { decodeIco } from "./ico/decodeIco";
import { IParsedCursor } from "types/IParsedCursor";
import { writeFileSync } from "fs";
import { randomUUID } from "crypto";
import { ImageData } from "types/ImageData";

export interface ParsedCursor extends IParsedCursor {
    cursor: ImageData & {hotspot: {x: number, y: number}}
}

export function sharpFromCursor(input: Buffer): ParsedCursor {
    const p = decodeIco(input)[0];

    const s = 
        p.type === "png" ? sharp(p.data) :
        sharp(Buffer.from(p.data), {
        raw: {
            width: p.width,
            height: p.height,
            channels: 4,
        }
    });

    return {
        sharp: s, cursor: p,

        frameCount: undefined, frameDuration: undefined,

        size: [p.width, p.height],
        hotSpot: [p.hotspot.x, p.hotspot.y],
    }
}