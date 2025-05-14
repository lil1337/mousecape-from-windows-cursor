import { ICursor } from "./IParsedCursor";

export interface CapeCursor extends ICursor {
    representations: Buffer[],
}