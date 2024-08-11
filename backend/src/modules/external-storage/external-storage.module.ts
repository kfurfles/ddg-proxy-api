import { Module } from '@nestjs/common';
import { FileTextService } from './services/file-text.service';

@Module({
	imports: [],
	providers: [FileTextService],
	exports: [FileTextService],
})
export class ExternalStorageModule {}
