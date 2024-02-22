import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { NucleoModule } from './nucleo/nucleo.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { EscolaModule } from './escola/escola.module';
import { ModalidadeModule } from './modalidade/modalidade.module';
import { SerieModule } from './serie/serie.module';

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
      entities: ['dist/src/**/*/*.entity.ts'],
      autoLoadEntities: true,
      synchronize: true,
      verboseRetryLog: true,
      logging: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    UsuarioModule,
    AuthModule,
    NucleoModule,
    EscolaModule,
    ModalidadeModule,
    SerieModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
