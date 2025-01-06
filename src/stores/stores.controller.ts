import { Body, Controller, Post, Get, NotFoundException, Param, Patch, Delete, UseInterceptors, ClassSerializerInterceptor, HttpCode} from '@nestjs/common';
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
    async findAllStore() {
        const stores = await this.storesService.findAll();
        return stores;
    }

    @Serialize(StoreResponseDto)
    @Get('/:storeId')
    async findOneStoreById(@Param('storeId') storeId: string) {
        const store = await this.storesService.findOneById(storeId);

        if (!store) {
        throw new NotFoundException(`Loja com ID: ${storeId} não encontrada`);
        }

        return store;
    }

    @Serialize(StoreResponseDto)
    @Patch('/:storeId')
    async updateStore(@Param('storeId') storeId: string, @Body() body: UpdateStoreDto){
        const store = await this.storesService.update(storeId, body);
        return store;
    }

    @Delete('/:storeId')
    @HttpCode(204)
    async removeStore(@Param('storeId') storeId: string) {
      const store = await this.storesService.findOneById(storeId);
    
      if (!store) {
        throw new NotFoundException(`Loja com ID: ${storeId} não encontrada`);
      }
    
      await this.storesService.remove(storeId);
    }
    
}