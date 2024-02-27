import { Module, forwardRef } from '@nestjs/common';
import { EscolaService } from './escola.service';
import { EscolaController } from './escola.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Escola } from './entities/escola.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Escola]), forwardRef(() => AuthModule)],
  controllers: [EscolaController],
  providers: [EscolaService],
  exports: [EscolaService],
})
export class EscolaModule {}
