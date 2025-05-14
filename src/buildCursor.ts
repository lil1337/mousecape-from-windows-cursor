import { compositeSharpFromAnimated } from "compositeSharpFromAnimated";
import { WindowsCursorKeys } from "parseInstall";
import { sharpFromCursor } from "sharpFromCursor";
import { IParsedCursor } from "types/IParsedCursor";
import { CapeCursor } from "types/PropertyList";

export async function buildCursor(cursor: Buffer, animated?: boolean): Promise<CapeCursor> {
    return await (animated ? compositeSharpFromAnimated(cursor) : Promise.resolve(sharpFromCursor(cursor))).then(
        async ({ hotSpot, sharp, size, frameCount, frameDuration }: IParsedCursor) =>
        ({
            hotSpot, size, frameCount, frameDuration,
            representations: [await sharp.png().toBuffer()] // TODO: add retina representations support
        })
    )
}