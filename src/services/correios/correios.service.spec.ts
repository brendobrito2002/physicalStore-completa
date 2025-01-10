import { Test, TestingModule } from '@nestjs/testing';
import { CorreiosService } from './correios.service';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('CorreiosService', () => {
  let service: CorreiosService;
  let mock: MockAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CorreiosService],
    }).compile();

    service = module.get<CorreiosService>(CorreiosService);
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should calculate shipping successfully for valid inputs', async () => {
    const postalCodeDestino = '01001000';
    const postalCodeOrigem = '02002000';

    const responseMock = [
      {
        prazo: '3 dias úteis',
        codProdutoAgencia: '40010',
        precoPPN: 'R$ 50,00',
        urlTitulo: 'SEDEX',
      },
    ];

    mock.onPost('https://www.correios.com.br/@@precosEPrazosView').reply(200, responseMock);

    const result = await service.calculateShipping(
      postalCodeDestino,
      postalCodeOrigem,
      '20',
      '15',
      '10',
    );

    expect(result).toEqual([
      {
        prazo: '3 dias úteis',
        codProdutoAgencia: '40010',
        price: 'R$ 50,00',
        description: 'SEDEX',
      },
    ]);
  });

  it('should throw an error for invalid inputs', async () => {
    const postalCodeDestino = '00000000';
    const postalCodeOrigem = '02002000';

    mock.onPost('https://www.correios.com.br/@@precosEPrazosView').reply(400, {
      status: 0,
      message: 'Houve um problema ao processar a sua solicitação, favor tentar novamente mais tarde.',
    });

    await expect(
      service.calculateShipping(postalCodeDestino, postalCodeOrigem, '20', '15', '10'),
    ).rejects.toThrow('Erro ao consultar frete nos correios');
  });
});
