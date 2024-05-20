import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Consumer, Kafka, KafkaMessage } from 'kafkajs';
import { HistoricoAlteracaoService } from '../historico-alteracao/historico-alteracao.service';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  private consumer: Consumer;

  constructor(
    private readonly historicoAlteracaoService: HistoricoAlteracaoService,
  ) {
    const config = new Kafka({
      brokers: [process.env.KAFKA_BROKER],
      ssl: true,
      sasl: {
        mechanism: 'scram-sha-256',
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD,
      },
    });

    this.consumer = config.consumer({ groupId: 'consumer-group' });
  }

  async onModuleInit(): Promise<void> {
    // await this.connectAndSubscribe(
    //   'HISTORICO-ALTERACAO',
    //   async (message: KafkaMessage) => {
    //     await this.processMessage(message);
    //   },
    // );
  }

  async onModuleDestroy(): Promise<void> {
    await this.consumer.disconnect();
  }

  async connectAndSubscribe(
    topic: string,
    callback: (message: KafkaMessage) => void,
  ): Promise<void> {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic, fromBeginning: false });
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        callback(message);
      },
    });
  }

  async processMessage(message: KafkaMessage): Promise<void> {
    const messageValue = message.value.toString();
    const parsedMessage = JSON.parse(messageValue);

    await this.historicoAlteracaoService.create(parsedMessage);
  }
}
