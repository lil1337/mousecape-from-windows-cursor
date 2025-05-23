// https://github.com/LinusU/decode-ico/tree/master

import decodeBmp from "./decodeBmp"

function isPng (view, offset) {
  return (view.readUint32LE(offset + 0) === 0x89504e47 && view.readUint32LE(offset + 4) === 0x0d0a1a0a)
}

function pngBitsPerPixel (view, offset) {
  const bitDepth = view.readUint8(offset + 24)
  const colorType = view.readUint8(offset + 25)

  if (colorType === 0) return bitDepth * 1
  if (colorType === 2) return bitDepth * 3
  if (colorType === 3) return bitDepth * 1
  if (colorType === 4) return bitDepth * 2
  if (colorType === 6) return bitDepth * 4

  throw new Error('Invalid PNG colorType')
}

function pngWidth (view, offset) {
  return view.readUint32LE(offset + 16, false)
}

function pngHeight (view, offset) {
  return view.readUint32LE(offset + 20, false)
}

export function decodeIco (input) {
  const view = Buffer.from(input);

  if (view.byteLength < 6) {
    throw new Error('Truncated header')
  }

  if (isPng(view, 0)) {
    // the file is actually a png masquerading as an ico

    return [{
      bpp: pngBitsPerPixel(view, 0),
      data: new Uint8Array(view.buffer, view.byteOffset, view.byteLength),
      height: pngHeight(view, 0),
      hotspot: null,
      type: 'png',
      width: pngWidth(view, 0)
    }]
  }

  if (view.readUint16LE(0, true) !== 0) {
    throw new Error('Invalid magic bytes')
  }

  const type = view.readUint16LE(2, true)

  if (type !== 1 && type !== 2) {
    throw new Error('Invalid image type')
  }

  const length = view.readUint16LE(4, true)

  if (view.byteLength < 6 + (16 * length)) {
    throw new Error('Truncated image list')
  }

  return Array.from({ length }, (_, idx) => {
    const width = view.readUint8(6 + (16 * idx) + 0)
    const height = view.readUint8(6 + (16 * idx) + 1)
    const size = view.readUint32LE(6 + (16 * idx) + 8, true)
    const offset = view.readUint32LE(6 + (16 * idx) + 12, true)

    const hotspot = (type !== 2 ? null : {
      x: view.readUint16LE(6 + (16 * idx) + 4, true),
      y: view.readUint16LE(6 + (16 * idx) + 6, true)
    })

    if (isPng(view, offset)) {
      return {
        bpp: pngBitsPerPixel(view, offset),
        data: new Uint8Array(view.buffer, view.byteOffset + offset, size),
        height: pngHeight(view, offset),
        hotspot,
        type: 'png',
        width: pngWidth(view, offset)
      }
    }

    const data = new Uint8Array(view.buffer, view.byteOffset + offset, size)
    const bmp = decodeBmp(data, { width, height, icon: true })

    return {
        data: bmp.data,
        colorSpace: "srgb",
        width: bmp.width,
        height: bmp.height,
        hotspot,
        type: "bmp",
        bpp: bmp.colorDepth
    }
  })
}