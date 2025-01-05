import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoresModule } from './stores/stores.module';
import { Store } from './stores/stores.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Store],
      synchronize: true
    }), 
    StoresModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
