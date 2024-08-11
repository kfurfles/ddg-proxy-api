import { readLines } from '@/lib/readlines';
import { Injectable } from '@nestjs/common';

import fs from 'fs';
import path from 'path';
import utils from 'util';
const asyncWriteFile = utils.promisify(fs.writeFile);
const asyncMkdir = utils.promisify(fs.mkdir);
const asyncAppendFile = utils.promisify(fs.appendFile);

@Injectable()
export class FileTextService {
	async createFile(filePath: string) {
		if (fs.existsSync(filePath)) {
			return;
		}
		await asyncMkdir(path.dirname(filePath), { recursive: true });
		return asyncWriteFile(filePath, '', { encoding: 'utf8' });
	}

	async appendRow(filePath: string, content: Buffer) {
		return asyncAppendFile(filePath, content);
	}

	async getRangeLines(filePath: string, startRange: number, endRange: number) {
		const rangeLines = Array.from(
			{ length: endRange - startRange },
			(_, idx) => idx + startRange,
		);

		return readLines(filePath, rangeLines);
	}
}
