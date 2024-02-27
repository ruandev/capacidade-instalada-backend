import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { NucleoModule } from './nucleo/nucleo.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { EscolaModule } from './escola/escola.module';
import { ModalidadeModule } from './modalidade/modalidade.module';
import { SerieModule } from './serie/serie.module';
import { SalaModule } from './sala/sala.module';
import { HistoricoAlteracaoModule } from './historico-alteracao/historico-alteracao.module';
import { KafkaModule } from './kafka/kafka.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: ['dist/src/**/*/*.entity.ts'],
      autoLoadEntities: true,
      synchronize: true,
      verboseRetryLog: false,
      logging: false,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    AuthModule,
    UsuarioModule,
    NucleoModule,
    EscolaModule,
    ModalidadeModule,
    SerieModule,
    SalaModule,
    HistoricoAlteracaoModule,
    KafkaModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
