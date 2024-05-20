import { Producer } from 'kafkajs';
import { KafkaProducerService } from './producer.service';
import { CreateHistoricoAlteracaoDto } from '../historico-alteracao/dto/create-historico-alteracao.dto';

// Mock da instância do produtor Kafka
const producerMock: Partial<Producer> = {
  connect: jest.fn(),
  send: jest.fn(),
};

describe('KafkaProducerService', () => {
  let service: KafkaProducerService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new KafkaProducerService();
    service['producer'] = producerMock as any;
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should send a message to HistoricoAlteracao topic', async () => {
    const message: CreateHistoricoAlteracaoDto = {
      usuario_id: '1',
      sala_id: '1',
      campo: 'Campo',
      valorAntigo: 'Valor Antigo',
      valorNovo: 'Valor Novo',
      flow_id: '1',
    };

    await service.sendMessageToHistoricoAlteracao(message);
    expect(producerMock.send).toHaveBeenCalledWith({
      topic: 'HISTORICO-ALTERACAO',
      messages: [{ value: JSON.stringify(message) }],
    });
  });
  it('should connect to Kafka on initialization', async () => {
    await service.onModuleInit();
    expect(producerMock.connect).toHaveBeenCalled();
  });
});
