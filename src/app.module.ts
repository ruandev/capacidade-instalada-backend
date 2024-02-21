import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { NucleoController } from './nucleo/nucleo.controller';
import { NucleoService } from './nucleo/nucleo.service';
import { NucleoModule } from './nucleo/nucleo.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { EscolaModule } from './escola/escola.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [],
      synchronize: true,
      logging: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    UsuarioModule,
    AuthModule,
    NucleoModule,
    EscolaModule,
  ],
  controllers: [AppController, NucleoController],
  providers: [AppService, NucleoService],
})
export class AppModule {}
