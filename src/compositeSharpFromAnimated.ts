import { parseAni } from "parseAniCursor";
import sharp, { Sharp } from "sharp";
import { ParsedCursor, sharpFromCursor } from "sharpFromCursor";
import { IParsedCursor } from "types/IParsedCursor";



export async function compositeSharpFromAnimated(buffer: Buffer): Promise<IParsedCursor & {
    frames: ParsedCursor[]
}> {
    const ani = parseAni(buffer);
   
    const frames = ani.images.map(sharpFromCursor);

    const composite = sharp({
        create: {
            background: "rgba(0,0,0,0)",
            width: frames[0].cursor.width,
            height: frames[0].cursor.height * frames.length,
            channels: 4
        }
    })
        .composite(await Promise.all(

            frames.map(async (frame, i) => ({
                input: await frame.sharp.png().toBuffer(),
                left: 0,
                top: 32 * i,
            })))
        );


    return {
        sharp: composite, frames, frameCount: ani.images.length,
        
        hotSpot: frames[0].hotSpot as [number, number],
        size: frames[0].size as [number, number],
        frameDuration: ani.images.length == 1 ? undefined : (ani.metadata.iDispRate || 30) / 60,
    };
}