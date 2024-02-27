import { Module, forwardRef } from '@nestjs/common';
import { SerieService } from './serie.service';
import { SerieController } from './serie.controller';
import { Serie } from './entities/serie.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Serie]), forwardRef(() => AuthModule)],
  controllers: [SerieController],
  providers: [SerieService],
})
export class SerieModule {}
