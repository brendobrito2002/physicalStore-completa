import { Body, Controller, Post, Get, NotFoundException, Param, Patch, Delete, UseInterceptors, ClassSerializerInterceptor} from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dtos/create-store.dto';
import { UpdateStoreDto } from './dtos/update-store.dto';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';

@Controller('stores')
export class StoresController {
    constructor(private storesService: StoresService) {}

    @Post('/create')
    async createStore(@Body() createStoreDto: CreateStoreDto) {
        const store = await this.storesService.create(createStoreDto);
        return store;
    }

    @Get('/')
    async findAllStore() {
        const stores = await this.storesService.findAll();
        return stores;
    }

    @UseInterceptors(SerializeInterceptor)
    @Get('/:storeId')
    async findOneStoreById(@Param('storeId') storeId: string) {
        const store = await this.storesService.findOneById(storeId);

        if (!store) {
        throw new NotFoundException(`Loja com ID: ${storeId} não encontrada`);
        }

        return store;
    }

    @Patch('/:storeId')
    async updateStore(@Param('storeId') storeId: string, @Body() body: UpdateStoreDto){
        const store = await this.storesService.update(storeId, body);
        return store;
    }

    @Delete('/:storeId') 
    async removeStore(@Param('storeId') storeId: string) { 
        return this.storesService.remove(storeId); 
    }
}