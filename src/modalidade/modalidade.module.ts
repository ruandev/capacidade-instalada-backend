import { Module, forwardRef } from '@nestjs/common';
import { ModalidadeService } from './modalidade.service';
import { ModalidadeController } from './modalidade.controller';
import { Modalidade } from './entities/modalidade.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Modalidade]),
    forwardRef(() => AuthModule),
  ],
  controllers: [ModalidadeController],
  providers: [ModalidadeService],
})
export class ModalidadeModule {}
