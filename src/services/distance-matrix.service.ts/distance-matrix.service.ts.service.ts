import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class DistanceMatrixService {
    private readonly distanceMatrixBaseUrl = 'https://maps.googleapis.com/maps/api/distancematrix/json';

    constructor(private configService: ConfigService) {}

    async calculateDistance(originLat: string, originLng: string, destinationLat: string, destinationLng: string): Promise<number> {
        try {
            const apiKey = this.configService.get<string>('GEOCODING_API_KEY');

            if (!apiKey) {
                throw new Error('Chave de API não está configurada.');
            }

            if (!originLat || !originLng || !destinationLat || !destinationLng) {
                throw new Error('As coordenadas fornecidas são inválidas.');
            }

            const originCoordinates = `${originLat},${originLng}`;
            const destinationCoordinates = `${destinationLat},${destinationLng}`;

            const response = await axios.get(this.distanceMatrixBaseUrl, {
                params: {
                    origins: originCoordinates,
                    destinations: destinationCoordinates,
                    key: apiKey,
                },
            });

            const result = response.data.rows[0].elements[0];

            if (result.status === 'OK') {
                const distanceInMeters = result.distance.value;
                const distanceInKm = distanceInMeters / 1000;

                return distanceInKm;
            } else {
                throw new Error(`Erro na resposta da API: ${result.status}`);
            }
        } catch (error) {
            throw new Error(`Erro ao calcular distância: ${error.response?.data?.error_message || error.message}`);
        }
    }
}
