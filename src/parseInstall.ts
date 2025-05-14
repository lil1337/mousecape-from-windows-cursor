export const windowsCursorKeyToMac = {
    "pointer": ["com.apple.coregraphics.Arrow"],
    "help": ["com.apple.cursor.40"],
    "working": ["com.apple.cursor.4", "com.apple.coregraphics.Wait"],
    "precision": ["com.apple.cursor.20", "com.apple.cursor.41", "com.apple.cursor.7", "com.apple.cursor.8"],
    "text": ["com.apple.coregraphics.IBeam"],
    "unavailable": ["com.apple.cursor.25", "com.apple.cursor.3"],
    "vert": ["com.apple.cursor.32"],
    "horz": ["com.apple.cursor.28"],
    "dgn1": ["com.apple.cursor.34"],
    "dgn2": ["com.apple.cursor.30"],
    "move": ["com.apple.coregraphics.Move", "com.apple.cursor.39"],
    "link": ["com.apple.cursor.13"],
} as const;

export type WindowsCursorKeys = keyof typeof windowsCursorKeyToMac;
export type MacCursorKeys = typeof windowsCursorKeyToMac[WindowsCursorKeys][number];

export type InstallInfStrings = {
    CUR_DIR: string;
    SCHEME_NAME: string;
    alternate: string;
    busy: string;
    dgn1: string;
    dgn2: string;
    hand: string;
    help: string;
    horz: string;
    link: string;
    move: string;
    person: string;
    pin: string;
    pointer: string;
    precision: string;
    text: string;
    unavailable: string;
    vert: string;
    working: string;
}

export const parseInstall = (o: string): InstallInfStrings => 
    Object.fromEntries(o.split("[Strings]")[1].split("\n").filter(e=>!e.trim().startsWith("#")).map(e=>e.trim().split("=").map(e=>e.trim().replaceAll("\"", ""))).filter(e=>e.length==2))