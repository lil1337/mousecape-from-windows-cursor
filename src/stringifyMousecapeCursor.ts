function groupStringByChars(str: string, n: number): string[] {
    const result = [];
    let offset = 0;

    while (true) {
        if (n > (str.length - offset)){
            result.push(str.slice(offset));
            break;
        }
        else{
            result.push(str.slice(offset, offset + n));
            offset += n;
        }
    }

    return result;
}

export const stringifyMousecapeCursor = (key: string, val: {
    frameCount?: number;
    frameDuration?: number;
    hotSpot: [number, number];
    size: [number, number];
    representations: Buffer[]
}) => 
`		<key>${key}</key>
		<dict>
			<key>FrameCount</key>
			<integer>${val.frameCount ?? 1}</integer>
			<key>FrameDuration</key>
			<real>${val.frameDuration ?? 1}</real>
			<key>HotSpotX</key>
			<real>${val.hotSpot?.[0]?.toFixed(1) ?? 0}</real>
			<key>HotSpotY</key>
			<real>${val.hotSpot?.[1]?.toFixed(1) ?? 0}</real>
			<key>PointsHigh</key>
			<real>${val.size?.[0] ?? 32}</real>
			<key>PointsWide</key>
			<real>${val.size?.[1] ?? 32}</real>
			<key>Representations</key>
			<array>
${val.representations.map(r => 
`				<data>\n` + 
groupStringByChars(r.toString("base64"), 44).map(e=>`\t\t\t\t${e}`).join("\n") +
`
				</data>`
)}
			</array>
		</dict>`