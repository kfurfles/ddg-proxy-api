import { FileTextService } from '@/modules/external-storage/services/file-text.service';
import { Inject, Injectable } from '@nestjs/common';
import { HISTORY_FILE_TOKEN } from '../contants';

interface Params {
	requestAt: Date;
	title: string;
	response: Record<string, any>;
}

@Injectable()
export class AddHistoryService {
	constructor(
		@Inject(HISTORY_FILE_TOKEN) private readonly historyFilePath: string,
		private readonly fileTextService: FileTextService,
	) {}

	async add({ requestAt, title, response }: Params): Promise<{
		id: string;
		title: string;
		response: Record<string, any>;
	}> {
		const row = {
			id: String(requestAt.getTime()),
			title,
			response,
		};
		this.fileTextService.appendRow(
			this.historyFilePath,
			Buffer.from(`${JSON.stringify(row)}\n`, 'utf8'),
		);
		return row;
	}
}
