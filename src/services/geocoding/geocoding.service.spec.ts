import { Test, TestingModule } from '@nestjs/testing';
import { GeocodingService } from './geocoding.service';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ConfigService } from '@nestjs/config';

describe('GeocodingService', () => {
  let service: GeocodingService;
  let mock: MockAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeocodingService, ConfigService],
    }).compile();

    service = module.get<GeocodingService>(GeocodingService);
    mock = new MockAdapter(axios);

    const configService = module.get<ConfigService>(ConfigService);
    jest.spyOn(configService, 'get').mockReturnValue('mocked-api-key');
  });

  afterEach(() => {
    mock.reset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return coordinates for a valid postal code', async () => {
    const postalCode = '01001000';
    const responseMock = {
      results: [
        {
          geometry: {
            location: {
              lat: -23.55052,
              lng: -46.633308,
            },
          },
        },
      ],
    };

    mock
      .onGet('https://maps.googleapis.com/maps/api/geocode/json')
      .reply(200, responseMock);

    const result = await service.getCoordinates(postalCode);

    expect(result).toEqual({
      latitude: -23.55052,
      longitude: -46.633308,
    });
  });

  it('should throw an error when no parameters are provided', async () => {
    await expect(service.getCoordinates()).rejects.toThrow(
      'Nenhum dos parâmetros fornecidos funcionou.',
    );
  });

  it('should throw an error when API returns no results', async () => {
    const postalCode = '99999999';
    const responseMock = {
      results: [],
    };

    mock
      .onGet('https://maps.googleapis.com/maps/api/geocode/json')
      .reply(200, responseMock);

    await expect(service.getCoordinates(postalCode)).rejects.toThrow(
      'Não foi possível obter as coordenadas do endereço.',
    );
  });

  it('should throw an error when API returns an error', async () => {
    const postalCode = '01001000';

    mock
      .onGet('https://maps.googleapis.com/maps/api/geocode/json')
      .reply(400, {
        error_message: 'Invalid request. Missing the "address" parameter.',
      });

    await expect(service.getCoordinates(postalCode)).rejects.toThrow(
      'Erro ao buscar as coordenadas: Invalid request. Missing the "address" parameter.',
    );
  });
});