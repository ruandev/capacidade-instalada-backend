import { Injectable } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { CreateHistoricoAlteracaoDto } from '../historico-alteracao/dto/create-historico-alteracao.dto';

@Injectable()
export class KafkaProducerService {
  private producer: Producer;

  constructor() {
    const config = new Kafka({
      brokers: [process.env.KAFKA_BROKER],
      ssl: true,
      sasl: {
        mechanism: 'scram-sha-256',
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD,
      },
    });

    this.producer = config.producer();
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
