import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { Store } from './stores.entity';
import { ViaCepService } from 'src/services/viacep/viacep.service';
import { GeocodingService } from 'src/services/geocoding/geocoding.service';

@Module({
  imports: [TypeOrmModule.forFeature([Store])],
  controllers: [StoresController],
  providers: [StoresService, ViaCepService, GeocodingService]
})
export class StoresModule {}
