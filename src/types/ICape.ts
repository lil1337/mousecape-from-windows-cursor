import { MacCursorKeys } from "parseInstall"
import { CapeCursor } from "./PropertyList"

export interface ICape {
    author: string,
    capeName: string,
    capeVersion: number,
    cloud: boolean,
    hiDpi: boolean,
    id: string,
    minimumVersion: number,
    version: number
}

export interface Cape extends ICape {
    cursors: Record<MacCursorKeys, CapeCursor>
}