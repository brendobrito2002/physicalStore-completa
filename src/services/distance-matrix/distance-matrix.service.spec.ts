import { Test, TestingModule } from '@nestjs/testing';
import { DistanceMatrixService } from './distance-matrix.service';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ConfigService } from '@nestjs/config';

describe('DistanceMatrixService', () => {
  let service: DistanceMatrixService;
  let mock: MockAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DistanceMatrixService, ConfigService],
    }).compile();

    service = module.get<DistanceMatrixService>(DistanceMatrixService);
    mock = new MockAdapter(axios);

    const configService = module.get<ConfigService>(ConfigService);
    jest.spyOn(configService, 'get').mockReturnValue('mocked-api-key');
  });

  afterEach(() => {
    mock.reset();
  });

  it('should calculate distance successfully with valid inputs', async () => {
    const originLat = '40.712776';
    const originLng = '-74.005974';
    const destinationLat = '34.052235';
    const destinationLng = '-118.243683';

    const responseMock = {
      rows: [
        {
          elements: [
            {
              status: 'OK',
              distance: {
                value: 4500000,
              },
            },
          ],
        },
      ],
    };

    mock
      .onGet('https://maps.googleapis.com/maps/api/distancematrix/json')
      .reply(200, responseMock);

    const result = await service.calculateDistance(originLat, originLng, destinationLat, destinationLng);

    expect(result).toBe(4500);
  });

  it('should throw an error with invalid coordinates', async () => {
    const originLat = '';
    const originLng = '-74.005974';
    const destinationLat = '34.052235';
    const destinationLng = '-118.243683';

    await expect(
      service.calculateDistance(originLat, originLng, destinationLat, destinationLng),
    ).rejects.toThrow('As coordenadas fornecidas são inválidas.');
  });

  it('should throw an error when API returns no results', async () => {
    const originLat = '40.712776';
    const originLng = '-74.005974';
    const destinationLat = '34.052235';
    const destinationLng = '-118.243683';

    const responseMock = {
      rows: [
        {
          elements: [
            {
              status: 'ZERO_RESULTS',
            },
          ],
        },
      ],
    };

    mock
      .onGet('https://maps.googleapis.com/maps/api/distancematrix/json')
      .reply(200, responseMock);

    await expect(
      service.calculateDistance(originLat, originLng, destinationLat, destinationLng),
    ).rejects.toThrow('Erro na resposta da API: ZERO_RESULTS');
  });
  
  it('should throw an error when API returns an error', async () => {
    const originLat = '40.712776';
    const originLng = '-74.005974';
    const destinationLat = '34.052235';
    const destinationLng = '-118.243683';

    mock
      .onGet('https://maps.googleapis.com/maps/api/distancematrix/json')
      .reply(400, {
        error_message: 'Invalid request. Missing the "key" parameter.',
      });

    await expect(
      service.calculateDistance(originLat, originLng, destinationLat, destinationLng),
    ).rejects.toThrow('Erro ao calcular distância: Invalid request. Missing the "key" parameter.');
  });
});
