import { ImageData } from "types/ImageData"

declare interface Hotspot {
  x: number
  y: number
}

declare interface BmpData extends ImageData {
  bpp: number
  hotspot: Hotspot
  type: 'bmp'
}

declare interface PngData extends ImageData {
  bpp: number
  data: Uint8Array
  height: number
  hotspot: Hotspot
  type: 'png'
  width: number
}

export function decodeIco (source: ArrayBuffer | Int8Array | Uint8Array | Uint8ClampedArray): (BmpData | PngData)[]

