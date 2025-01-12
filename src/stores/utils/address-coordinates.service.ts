import { Injectable } from '@nestjs/common';
import { ViaCepService } from 'src/services/viacep/viacep.service';
import { GeocodingService } from 'src/services/geocoding/geocoding.service';

@Injectable()
export class AddressCoordinatesService {
    constructor(
        private viaCepService: ViaCepService,
        private geocodingService: GeocodingService,
    ) {}

    async enrichAddress(postalCode: string, address?: string, country?: string): Promise<any> {
        const enrichedData: Partial<any> = {};

        const cepData = await this.viaCepService.getAddressByCep(postalCode);
        if (cepData) {
            enrichedData.city = cepData.city;
            enrichedData.district = cepData.district;
            enrichedData.state = cepData.state;
            enrichedData.address = cepData.address;
        }

        const coordinates = await this.geocodingService.getCoordinates(postalCode, enrichedData.address, country);
        if (coordinates) {
            enrichedData.latitude = coordinates.latitude;
            enrichedData.longitude = coordinates.longitude;
        }

        return enrichedData;
    }
}