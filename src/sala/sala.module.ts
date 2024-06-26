import { Module, forwardRef } from '@nestjs/common';
import { SalaService } from './sala.service';
import { SalaController } from './sala.controller';
import { Sala } from './entities/sala.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sala]),
    forwardRef(() => AuthModule),
    KafkaModule,
  ],
  controllers: [SalaController],
  providers: [SalaService],
})
export class SalaModule {}
