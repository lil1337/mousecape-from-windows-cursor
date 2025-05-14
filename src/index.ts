export {buildMousecape} from "buildMousecape";
export {stringifyMousecapeCursor} from "stringifyMousecapeCursor";
export {stringifyMousecape} from "stringifyMousecape";
export {sharpFromCursor, ParsedCursor} from "sharpFromCursor";
export {compositeSharpFromAnimated} from "compositeSharpFromAnimated";

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