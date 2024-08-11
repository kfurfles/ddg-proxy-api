import path from 'path';
import fs from 'fs';
import utils from 'util';
import { env } from '@/config/env';
const asyncWriteFile = utils.promisify(fs.writeFile);
const CACHE_ENRICHMENT_RAW_DATA = path.join(
	env.ROOT_PATH,
	'fixtures',
	'cache-enrichment.json',
);

export async function enrichemntBlobFixture(blobPathFile: string) {
	const data = JSON.parse(
		fs.readFileSync(CACHE_ENRICHMENT_RAW_DATA, {
			encoding: 'utf8',
		}),
	) as Record<string, any>[];

	const textContent = data.reduce(
		(acc, cur) => `${acc}${JSON.stringify(cur)}\n`,
		'',
	);

	await asyncWriteFile(blobPathFile, textContent, { encoding: 'utf8' });

	return data;
}
