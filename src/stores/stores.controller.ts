import { Body, Controller, Post, Get, NotFoundException, Param, Patch, Delete, HttpCode, Query} from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dtos/create-store.dto';
import { UpdateStoreDto } from './dtos/update-store.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
  
@ApiTags('Stores')
@Controller('stores')
export class StoresController {
    constructor(private storesService: StoresService) {}

    @Post()
    @ApiOperation({ summary: 'Criar uma loja' })
    @ApiResponse({ status: 201, description: 'Loja criada com sucesso.' })
    async createStore(@Body() createStoreDto: CreateStoreDto) {
        const store = await this.storesService.create(createStoreDto);
        return store;
    }

    @Get()
    @ApiOperation({ summary: 'Listar todas as lojas' })
    @ApiResponse({ status: 200, description: 'Lista retornada com sucesso.' })
    async listAll() {
        const stores = await this.storesService.findAll();
        return stores;
    }

    @Get('/:storeID')
    @ApiOperation({ summary: 'Obter detalhes de uma loja pelo ID' })
    @ApiParam({ name: 'storeID', description: 'ID da loja', type: String })
    @ApiResponse({ status: 200, description: 'Loja encontrada.' })
    @ApiResponse({ status: 404, description: 'Loja não encontrada.' })
    async storeById(@Param('storeID') storeID: string) {
        const store = await this.storesService.findOneById(storeID);

        if (!store) {
        throw new NotFoundException(`Loja com ID: ${storeID} não encontrada`);
        }

        return store;
    }

    @Get('/state/:state')
    @ApiOperation({ summary: 'Listar lojas por estado' })
    @ApiParam({ name: 'state', description: 'Estado estão localizadas as lojas', type: String })
    @ApiResponse({ status: 200, description: 'Lojas encontradas com sucesso.' })
    @ApiResponse({ status: 404, description: 'Nenhuma loja encontrada para o estado informado.' })
    async storeByState(@Param('state') state: string){
        const stores = await this.storesService.findAllStoreByState(state);
        return stores;
    }

    @Patch('/:storeID')
    @ApiOperation({ summary: 'Atualizar detalhes de uma loja' })
    @ApiParam({ name: 'storeID', description: 'ID da loja', type: String })
    @ApiResponse({ status: 200, description: 'Loja atualizada com sucesso.' })
    @ApiResponse({ status: 404, description: 'Loja não encontrada.' })
    async updateStore(@Param('storeID') storeID: string, @Body() body: UpdateStoreDto){
        const store = await this.storesService.update(storeID, body);
        return store;
    }

    @Delete('/:storeID')
    @HttpCode(204)
    @ApiOperation({ summary: 'Excluir uma loja pelo ID' })
    @ApiParam({ name: 'storeID', description: 'ID da loja', type: String })
    @ApiResponse({ status: 204, description: 'Loja excluída com sucesso.' })
    @ApiResponse({ status: 404, description: 'Loja não encontrada.' })
    async removeStore(@Param('storeID') storeID: string) {
      const store = await this.storesService.findOneById(storeID);
    
      if (!store) {
        throw new NotFoundException(`Loja com ID: ${storeID} não encontrada`);
      }
    
      await this.storesService.remove(storeID);
    }

    @Get('/postalCode/:postalCode')
    @ApiOperation({ summary: 'Encontrar lojas próximas ao CEP informado' })
    @ApiParam({ name: 'postalCode', description: 'CEP para busca', type: String })
    @ApiResponse({ status: 200, description: 'Lojas encontradas próximas ao CEP.' })
    @ApiResponse({ status: 404, description: 'Nenhuma loja encontrada próxima ao CEP informado.' })
    async storeByCep(@Param('postalCode') postalCode: string) {
        const result = await this.storesService.storeByCep(postalCode);
    
        if (!result.stores.length) {
            throw new NotFoundException(`Nenhuma loja ou PDV próximo ao CEP ${postalCode} encontrado`);
        }
    
        return result;
    }    
    
}