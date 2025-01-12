import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { COUNTRY } from '../../stores/constants/store.constants';

@Injectable()
export class GeocodingService {
    private readonly geocodingBaseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

    constructor(private configService: ConfigService) { }

    async getCoordinates(postalCode?: string, address?: string, country?: string): Promise<{ latitude: string, longitude: string }> {
        try {
            const apiKey = this.configService.get<string>('GEOCODING_API_KEY');
            country = COUNTRY;

            if (!apiKey) {
                throw new Error('Chave de API não está funcionando.');
            }

            if (!postalCode && !address && !country) {
                throw new Error('Nenhum dos parâmetros fornecidos funcionou.');
            }

            let formattedAddress = '';
            if (postalCode) formattedAddress += postalCode;
            if (address) formattedAddress += formattedAddress ? `, ${address}` : address;
            if (country) formattedAddress += formattedAddress ? `, ${country}` : country;

            const response = await axios.get(this.geocodingBaseUrl, {
                params: {
                    address: formattedAddress,
                    key: apiKey,
                },
            });

            const result = response.data.results[0];

            if (result) {
                const latitude = result.geometry.location.lat;
                const longitude = result.geometry.location.lng;
                return { latitude, longitude };
            }

            throw new Error('Não foi possível obter as coordenadas do endereço.');
        } catch (error) {
            throw new Error(`Erro ao buscar as coordenadas: ${error.response?.data?.error_message || error.message}`);
        }
    }
}
