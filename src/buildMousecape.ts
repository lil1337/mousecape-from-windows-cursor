import { compositeSharpFromAnimated } from "compositeSharpFromAnimated";
import { MacCursorKeys, WindowsCursorKeys } from "parseInstall";
import { windowsCursorKeyToMac } from "parseInstall";
import { sharpFromCursor } from "sharpFromCursor";
import { Cape, ICape } from "types/ICape";
import { IParsedCursor } from "types/IParsedCursor";
import { CapeCursor } from "types/PropertyList";

export async function buildMousecape(
    cursors: Record<string | (keyof typeof windowsCursorKeyToMac), {cursor: Buffer, animated?: boolean}>,
    o?: Partial<ICape>
): Promise<Cape> {

    cursors = Object.fromEntries(
        Object.entries(cursors).filter(([key]) => (key in windowsCursorKeyToMac))
    );

    const windowsBuiltCursors = Object.fromEntries(await Promise.all(Object.entries(cursors).map(
        async ([key, {cursor, animated}]) =>
            await (animated ? compositeSharpFromAnimated(cursor) : Promise.resolve(sharpFromCursor(cursor))).then(
                async ({hotSpot, sharp, size, frameCount, frameDuration}: IParsedCursor) => 
                ([key, {
                        hotSpot, size, frameCount, frameDuration,
                        representations: [await sharp.png().toBuffer()] // TODO: add retina representations support
                    }] as [WindowsCursorKeys, CapeCursor])
            )
    )));

    const builtCursors = Object.entries(cursors).reduce((acc, [key, cursor]) => {
        windowsCursorKeyToMac[key]!.map((e: MacCursorKeys) =>{
            acc[e] = windowsBuiltCursors[key]
        });
        return acc;
    }, {} as Record<MacCursorKeys, CapeCursor>);
    
    
    const now = Date.now();

    return {
        cursors: builtCursors,

        author: o.author ?? "",
        capeName: o.capeName ?? "Cape",
        capeVersion: o.capeVersion ?? 1,
        cloud: o.cloud ?? false,
        hiDpi: o.hiDpi ?? false,
        id: o.id ?? `cat.hollow.${o.capeName.replaceAll(/[^a-zA-Z0-9/]+/g, "") ?? "Cape"}.${(now/1000).toFixed(0)}.${now.toString().substring(now.toString().length - 6)}`,
        minimumVersion: o.minimumVersion ?? 2,
        version: o.version ?? 2,
    }

}