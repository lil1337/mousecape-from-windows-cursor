// https://gist.github.com/RepComm/8bc4d6bcd96559db7a49dd8269f3dfb1

/* Built using Matthew Sachin's documentation as reference
 * https://github.com/MathewSachin/NIco/wiki/Ico,-Cur-and-PE-Formats
 * See example function 'test'
 * 
 * Abilities:
 * Read a cursor or icon file and get it's image data (raw)
 *
 * Future plans:
 * Read and then parse into different data sets for convenience like:
 *   1d arrays of hex/web colors, or int colors
 *   2d arrays of the same types (for the lazy)
 * Converting to other image formats is up to the user! Have fun!
 */

import { readFile } from "fs";

class WinCursorParser {
    constructor () {
        
    }
    
    parseBuffer (buf) {
        
        let result = {
            read:true,
            error:false
        };
        if (buf.readUInt16LE(0) !== 0) {
            console.log("Header short should be 0x00, because it's reserved..");
        }
        let temp = buf.readUInt16LE(2);
        if (temp === 1) {
            result.type = "icon";
        } else if (temp === 2) {
            result.type = "cursor";
        } else {
            result.type = temp.toString();
        }
        temp = buf.readUInt16LE(4);
        if (temp < 1) 
            throw new Error("No images in this \"" + result.type + "\" file");
        
        
        result.imageEntries = new Array(temp);
        let offset = 6;
        
        let imageData = undefined;
        for (let i=0; i<result.imageEntries.length; i++) {
            imageData = {};
            imageData.width = buf.readUInt8(offset);
            offset+=1;
            
            imageData.height = buf.readUInt8(offset);
            offset+=1;
            imageData.colorsInPalette = buf.readUInt8(offset);
            offset+=2; //Skip unused byte also
            imageData.hotspotX = buf.readUInt16LE(offset);
            offset+=2;
            imageData.hotspotY = buf.readUInt16LE(offset);
            offset+=2;
            imageData.byteLength = buf.readUInt32LE(offset);
            offset+=4;
            imageData.offsetInFile = buf.readUInt32LE(offset);
            offset += 4;
            
            result.imageEntries[i] = imageData;
        }
        
        
        for (let i=0; i<result.imageEntries.length; i++) {
            imageData = result.imageEntries[i];
            imageData.raw = new Buffer.alloc(imageData.byteLength);
        
            //Copy the image data from the file data (buffer)
            buf.copy(
                imageData.raw,
                0,
                imageData.offsetInFile,
                imageData.byteLength
            );
        }
        return result;
    }
    
    parseFile (fname, callback) {
        readFile(
            fname,
            null,
            (err, buf) => {
                this.parseBuffer(err, buf, callback);
            }
        );
    }
}

export default WinCursorParser;