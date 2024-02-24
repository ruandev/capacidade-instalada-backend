import { Consumer, KafkaMessage } from 'kafkajs';
import { KafkaConsumerService } from './consumer.service';
import { CreateHistoricoAlteracaoDto } from '../historico-alteracao/dto/create-historico-alteracao.dto';

const consumerMock: Partial<Consumer> = {
  connect: jest.fn(),
  subscribe: jest.fn(),
  run: jest.fn(),
  disconnect: jest.fn(),
};
const historicoAlteracaoServiceMock = {
  create: jest.fn(),
};

describe('KafkaConsumerService', () => {
  let service: KafkaConsumerService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new KafkaConsumerService(historicoAlteracaoServiceMock as any);
    service['consumer'] = consumerMock as any;
  });
  it('should connect and subscribe to Kafka topic on initialization', async () => {
    await service.onModuleInit();
    expect(consumerMock.connect).toHaveBeenCalled();
    expect(consumerMock.subscribe).toHaveBeenCalledWith({
      topic: 'HISTORICO-ALTERACAO',
      fromBeginning: false,
    });
    expect(consumerMock.run).toHaveBeenCalled();
  });
  it('should disconnect from Kafka on destruction', async () => {
    await service.onModuleDestroy();
    expect(consumerMock.disconnect).toHaveBeenCalled();
  });
  it('should process Kafka messages correctly', async () => {
    const createDto: CreateHistoricoAlteracaoDto = {
      usuario_id: '1',
      sala_id: '1',
      campo: 'Campo',
      valorAntigo: 'Valor Antigo',
      valorNovo: 'Valor Novo',
      flow_id: '1',
    };
    const kafkaMessageMock: KafkaMessage = {
      key: null,
      value: Buffer.from(JSON.stringify(createDto)),
      headers: null,
      attributes: 0,
      offset: '0',
      timestamp: '0',
    };

    await service.processMessage(kafkaMessageMock);
    expect(historicoAlteracaoServiceMock.create).toHaveBeenCalledWith(
      createDto,
    );
  });
  it('should handle errors gracefully when processing Kafka messages', async () => {
    historicoAlteracaoServiceMock.create.mockRejectedValueOnce(
      new Error('Erro ao criar registro'),
    );

    const kafkaMessageMock: KafkaMessage = {
      key: null,
      value: Buffer.from(JSON.stringify({ teste: 'teste' })),
      headers: null,
      attributes: 0,
      offset: '0',
      timestamp: '0',
    };

    // Verificando se uma exceção é lançada ao processar a mensagem
    await expect(service.processMessage(kafkaMessageMock)).rejects.toThrow(
      'Erro ao criar registro',
    );
  });
});
