import { Module, forwardRef } from '@nestjs/common';
import { NucleoService } from './nucleo.service';
import { NucleoController } from './nucleo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nucleo } from './entities/nucleo.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Nucleo]), forwardRef(() => AuthModule)],
  controllers: [NucleoController],
  providers: [NucleoService],
})
export class NucleoModule {}
