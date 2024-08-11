import { exec } from 'child_process';
import utils from 'util';
const asyncExec = utils.promisify(exec);

export async function readLinesSed(
	filePath: string,
	lines: number[],
): Promise<string[]> {
	const r = await asyncExec(
		`sed -n '${lines.map((i_1) => i_1 + 'p').join(';')}' ${filePath}`,
	);
	return r.stdout.split('\n');
}
