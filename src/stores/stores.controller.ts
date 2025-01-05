import { Body, Controller, Post, Get, NotFoundException, Param, Patch, Delete} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dtos/create-store.dto';
import { StoreResponseDto } from './dtos/store-response-dto';
import { UpdateStoreDto } from './dtos/update-store-dto';

@Controller('stores')
export class StoresController {
    constructor(private storesService: StoresService) {}

    @Post('/create')
    async createStore(@Body() createStoreDto: CreateStoreDto) {
        const store = await this.storesService.create(createStoreDto);
        return plainToInstance(StoreResponseDto, store);
    }

    @Get('/')
    async findAllStore() {
        const stores = await this.storesService.findAll();
        return plainToInstance(StoreResponseDto, stores);
    }

    @Get('/:storeId')
    async findOneStoreById(@Param('storeId') storeId: string) {
        const store = await this.storesService.findOneById(storeId);

        if (!store) {
        throw new NotFoundException(`Loja com ID: ${storeId} não encontrada`);
        }

        return plainToInstance(StoreResponseDto, store);
    }

    @Patch('/:storeId')
    async updateStore(@Param('storeId') storeId: string, @Body() body: UpdateStoreDto){
        const store = await this.storesService.update(storeId, body);
        return plainToInstance(StoreResponseDto, store);
    }

    @Delete('/:storeId') 
    async removeStore(@Param('storeId') storeId: string) { 
        return this.storesService.remove(storeId); 
    }
}