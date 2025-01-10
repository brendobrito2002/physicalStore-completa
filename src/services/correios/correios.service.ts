import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CorreiosService {
    private readonly correiosBaseUrl = 'https://www.correios.com.br/@@precosEPrazosView';

    async calculateShipping(
        destinationCep: string,
        originCep: string,
        length: string,
        height: string,
        width: string
    ): Promise<any[]>{
        try{
            const response = await axios.post(this.correiosBaseUrl, {
                cepDestino: destinationCep,
                cepOrigem: originCep,
                comprimento: length,
                largura: width,
                altura: height
            });

            if(response.status === 200){
                return response.data.map((item: any) =>({
                    prazo: item.prazo,
                    codProdutoAgencia: item.codProdutoAgencia,
                    price: item.precoPPN,
                    description: item.urlTitulo
                }));
            }
            console.log(response.data.price);

            throw new Error('Erro na resposta da API dos correios');
        }catch(error){
            throw new Error(`Erro ao consultar frete nos correios: ${error.message}`);
        }
    }
}
