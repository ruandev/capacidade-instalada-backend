import { Injectable } from '@nestjs/common';
import { Producer } from 'kafkajs';
import { CreateHistoricoAlteracaoDto } from '../historico-alteracao/dto/create-historico-alteracao.dto';
import { kafkaConfig } from './config';

@Injectable()
export class KafkaProducerService {
  private producer: Producer;

  constructor() {
    this.producer = kafkaConfig.producer();
  }

  async onModuleInit(): Promise<void> {
    this.producer.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.producer.disconnect();
  }

  async sendMessageToHistoricoAlteracao(
    message: CreateHistoricoAlteracaoDto,
  ): Promise<void> {
    await this.producer.send({
      topic: 'HISTORICO-ALTERACAO',
      messages: [{ value: JSON.stringify(message) }],
    });
  }
}
