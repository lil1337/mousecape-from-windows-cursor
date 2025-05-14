import { stringifyMousecapeCursor } from "stringifyMousecapeCursor";
import { Cape, ICape } from "types/ICape";

export const stringifyMousecape = (cape: Cape) =>
	actuallyStringifyMousecape({
		...cape, 
		cursors: Object.entries(cape.cursors).map(e=>stringifyMousecapeCursor(e[0], e[1]))
	});


const actuallyStringifyMousecape = (cape: ICape & {cursors: string[]}) =>
`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>Author</key>
	<string>${cape.author}</string>
	<key>CapeName</key>
	<string>${cape.capeName}</string>
	<key>CapeVersion</key>
	<real>${cape.capeVersion}</real>
	<key>Cloud</key>
	${cape.cloud ? `<true/>` : `<false/>`}
	<key>Cursors</key>
	<dict>
${cape.cursors.join("\n")}
	</dict>
	<key>HiDPI</key>
	${cape.hiDpi ? `<true/>` : `<false/>`}
	<key>Identifier</key>
	<string>${cape.id}</string>
	<key>MinimumVersion</key>
	<real>${cape.minimumVersion}</real>
	<key>Version</key>
	<real>${cape.version}</real>
</dict>
</plist>`