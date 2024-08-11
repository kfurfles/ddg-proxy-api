export type RecordFile = {
	id: number;
	dataId: string;
	content: Record<string, any>;
};

export interface ExternalHistoryStorage {
	add(params: {
		dataId: string;
		content: Record<string, any>;
	}): Promise<{ id: number; dataId: string; content: Record<string, any> }[]>;

	getByDataId(dataId: string): Promise<RecordFile | null>;

	getByOffset(offset: number): Promise<RecordFile[]>;
}
