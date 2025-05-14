import { ImageData } from "types/ImageData"

declare interface Options {
  width?: number
  height?: number
  icon?: boolean
}

declare function decodeBmp (source: ArrayBuffer | Int8Array | Uint8Array | Uint8ClampedArray, options?: Options): ImageData & { colorDepth: number }

export = decodeBmp