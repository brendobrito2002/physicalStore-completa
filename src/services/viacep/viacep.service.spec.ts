import { Test, TestingModule } from '@nestjs/testing';
import { ViaCepService } from './viacep.service';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { NotFoundException } from '@nestjs/common';

describe('ViacepService', () => {
  let service: ViaCepService;
  let mock: MockAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ViaCepService],
    }).compile();

    service = module.get<ViaCepService>(ViaCepService);
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return address for a valid postal code', async() =>{
    const postalCode = '01001000';
    mock.onGet(`https://viacep.com.br/ws/${postalCode}/json/`).reply(200, {
      localidade: 'São Paulo',
      bairro: 'Sé',
      estado: 'São Paulo',
      logradouro: 'Praça da Sé'
    });

    const result = await service.getAddressByCep(postalCode);

    expect(result).toEqual({
      city: 'São Paulo',
      district: "Sé",
      state: 'São Paulo',
      address: 'Praça da Sé'
    });
  });

  it('should throw NotFoundException for an invalid postal code', async () => {
    const invalidPostalCode = '00000000';
    mock.onGet(`https://viacep.com.br/ws/${invalidPostalCode}/json/`).reply(200, {
      erro: true,
    });

    await expect(service.getAddressByCep(invalidPostalCode)).rejects.toThrow(
      NotFoundException,
    );
  });
});
