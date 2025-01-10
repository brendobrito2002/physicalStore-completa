import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { Store } from './stores.entity';
import { ViaCepService } from 'src/services/viacep/viacep.service';
import { GeocodingService } from 'src/services/geocoding/geocoding.service';
import { DistanceMatrixService } from 'src/services/distance-matrix.service.ts/distance-matrix.service.ts.service';
import { CorreiosService } from 'src/services/correios/correios.service';

@Module({
  imports: [TypeOrmModule.forFeature([Store])],
  controllers: [StoresController],
  providers: [StoresService, ViaCepService, GeocodingService, DistanceMatrixService, CorreiosService]
})
export class StoresModule {}
