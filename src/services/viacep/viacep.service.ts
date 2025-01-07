import { Injectable, NotFoundException } from "@nestjs/common";
import axios from 'axios';

@Injectable()
export class ViaCepService {
    private readonly viacepBaseUrl = 'https://viacep.com.br/ws';

    async getAddressByCep(postalCode: string){
        try {
            const { data } = await axios.get(`${this.viacepBaseUrl}/${postalCode}/json/`);
            
            if (data.erro){
                throw new NotFoundException(`Endereço não encontrado para o CEP: ${postalCode}`);
            }

            return {
                city: data.localidade,
                district: data.bairro,
                state: data.estado,
                address1: data.logradouro
            }

        } catch(error) {
            throw new NotFoundException(`Endereço não encontrado ao buscar o CEP: ${postalCode}`);
        }
    }
}