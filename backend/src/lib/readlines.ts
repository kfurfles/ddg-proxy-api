import fs from 'fs';

export async function readLines(
	filePath: string,
	lines: number[],
): Promise<{ lines: string[]; total: number }> {
	return new Promise((resolve, reject) => {
		const fileStream = fs.createReadStream(filePath, { encoding: 'utf8' });
		let remaining = '';
		let currentLineNumber = 0;
		const specificLines = [];

		fileStream.on('data', (chunk) => {
			remaining += chunk;
			let index = remaining.indexOf('\n');

			while (index > -1) {
				const line = remaining.substring(0, index);
				remaining = remaining.substring(index + 1);
				currentLineNumber++;

				if (lines.includes(currentLineNumber)) {
					specificLines.push(line);
				}

				index = remaining.indexOf('\n');
			}
		});

		fileStream.on('end', () => {
			if (remaining.length > 0) {
				currentLineNumber++;
				if (lines.includes(currentLineNumber)) {
					specificLines.push(remaining);
				}
			}

			resolve({ lines: specificLines, total: currentLineNumber });
		});

		fileStream.on('error', (error) => {
			reject(error);
		});
	});
}
