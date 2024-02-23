import { Module } from '@nestjs/common';
import { HistoricoAlteracaoService } from './historico-alteracao.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoricoAlteracao } from './entities/historico-alteracao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HistoricoAlteracao])],
  controllers: [],
  providers: [HistoricoAlteracaoService],
})
export class HistoricoAlteracaoModule {}
