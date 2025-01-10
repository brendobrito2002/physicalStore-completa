import { Body, Controller, Post, Get, NotFoundException, Param, Patch, Delete, HttpCode, Query} from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dtos/create-store.dto';
import { UpdateStoreDto } from './dtos/update-store.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { StoreResponseDto } from './dtos/store-response.dto';

@Controller('stores')
export class StoresController {
    constructor(private storesService: StoresService) {}

    @Serialize(StoreResponseDto)
    @Post('/create')
    async createStore(@Body() createStoreDto: CreateStoreDto) {
        const store = await this.storesService.create(createStoreDto);
        return store;
    }

    @Serialize(StoreResponseDto)
    @Get('/')
    async listAll() {
        const stores = await this.storesService.findAll();
        return stores;
    }

    @Serialize(StoreResponseDto)
    @Get('/:storeID')
    async storeById(@Param('storeID') storeID: string) {
        const store = await this.storesService.findOneById(storeID);

        if (!store) {
        throw new NotFoundException(`Loja com ID: ${storeID} não encontrada`);
        }

        return store;
    }

    @Serialize(StoreResponseDto)
    @Get('/storeByState/:state')
    async storeByState(@Param('state') state: string){
        const stores = await this.storesService.findAllStoreByState(state);
        return stores;
    }

    @Serialize(StoreResponseDto)
    @Patch('/:storeID')
    async updateStore(@Param('storeID') storeID: string, @Body() body: UpdateStoreDto){
        const store = await this.storesService.update(storeID, body);
        return store;
    }

    @Delete('/:storeID')
    @HttpCode(204)
    async removeStore(@Param('storeID') storeID: string) {
      const store = await this.storesService.findOneById(storeID);
    
      if (!store) {
        throw new NotFoundException(`Loja com ID: ${storeID} não encontrada`);
      }
    
      await this.storesService.remove(storeID);
    }

    @Get('/storeByCep/:postalCode')
    async storeByCep(@Param('postalCode') postalCode: string) {
        const result = await this.storesService.storeByCep(postalCode);
    
        if (!result.stores.length) {
            throw new NotFoundException(`Nenhuma loja ou PDV próximo ao CEP ${postalCode} encontrado`);
        }
    
        return result;
    }    
    
}