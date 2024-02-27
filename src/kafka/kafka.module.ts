import { Module } from '@nestjs/common';
import { KafkaProducerService } from './producer.service';
import { KafkaConsumerService } from './consumer.service';
import { HistoricoAlteracaoModule } from 'src/historico-alteracao/historico-alteracao.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, HistoricoAlteracaoModule],
  providers: [KafkaProducerService, KafkaConsumerService],
  exports: [KafkaProducerService],
})
export class KafkaModule {}
