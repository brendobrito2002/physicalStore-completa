import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoresModule } from './stores/stores.module';
import { Store } from './stores/stores.entity';
import { DataSourceOptions } from 'typeorm';
import { DistanceMatrixService } from './services/distance-matrix/distance-matrix.service';
import { CorreiosService } from './services/correios/correios.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): DataSourceOptions => ({
        type: 'sqlite',
        database: 'db.sqlite',
        entities: [Store],
        synchronize: true,
      }),
    }),
    StoresModule,
  ],
  controllers: [AppController],
  providers: [AppService, DistanceMatrixService, CorreiosService],
})
export class AppModule { }