import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class GeocodingService {
    private readonly geocodingBaseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

    constructor(private configService: ConfigService){}

    async getCoordinatesByAddress(postalCode: string): Promise<{ latitude: string, longitude: string }>{
        try{
            const apiKey = this.configService.get<string>('GEOCODING_API_KEY');

            const response = await axios.get(this.geocodingBaseUrl, {
                params:{
                    address: postalCode,
                    key: apiKey
                },
            });

            const result = response.data.results[0];

            if(result){
                const latitude = result.geometry.location.lat;
                const longitude = result.geometry.location.lng;

                return { latitude: latitude, longitude: longitude };
            }

            throw new Error('Não foi possivel obter as coordenadas do endereço')
        }catch(error){
            throw new Error(`Erro ao buscar as coordenadas: ${error.message}`);
        }
    }
}
