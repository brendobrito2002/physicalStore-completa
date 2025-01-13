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
        prazo: '1 dia útil',
        codProdutoAgencia: '04014',
        precoPPN: 'R$ 9,98',
        urlTitulo: 'Sedex a encomenda expressa dos Correios',
      },
      {
        prazo: '5 dias úteis',
        codProdutoAgencia: '04510',
        precoPPN: 'R$ 15,33',
        urlTitulo: 'PAC a encomenda economica dos Correios',
      }
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
        prazo: '1 dia útil',
        codProdutoAgencia: '04014',
        price: 'R$ 9,98',
        description: 'Sedex a encomenda expressa dos Correios',
      },
      {
        prazo: '5 dias úteis',
        codProdutoAgencia: '04510',
        price: 'R$ 15,33',
        description: 'PAC a encomenda economica dos Correios',
      }
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
