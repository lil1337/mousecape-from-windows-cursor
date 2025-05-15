export {buildMousecape} from "buildMousecape";
export {buildCursor} from "buildCursor";
export {stringifyMousecapeCursor} from "stringifyMousecapeCursor";
export {stringifyMousecape} from "stringifyMousecape";
export {sharpFromCursor, ParsedCursor} from "sharpFromCursor";
export {compositeSharpFromAnimated, sharpFromAnimated} from "compositeSharpFromAnimated";

export {
    parseAni, 
    AniMetadata, 
    ParsedAni,
    Chunk as AniChunk
} from "parseAniCursor";

export * from "./types";

export {
    windowsCursorKeyToMac,
    MacCursorKeys,
    WindowsCursorKeys,
    InstallInfStrings,
    parseInstall
} from "parseInstall";