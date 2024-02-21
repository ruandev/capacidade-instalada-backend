import { Module } from '@nestjs/common';
import { EscolaService } from './escola.service';
import { EscolaController } from './escola.controller';

@Module({
  controllers: [EscolaController],
  providers: [EscolaService],
})
export class EscolaModule {}
