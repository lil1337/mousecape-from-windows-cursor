import { Sharp } from "sharp";

export interface IParsedCursor extends ICursor {
    sharp: Sharp, 
}

export interface ICursor { 
    size: [number, number],
    hotSpot: [number, number],
    frameCount?: number,
    frameDuration?: number,
}