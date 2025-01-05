import { Body, Controller, Post} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dtos/create-store.dto';
import { StoreResponseDto } from './dtos/store-response-dto';

@Controller('stores')
export class StoresController {
  constructor(private storesService: StoresService) {}

  @Post('/create')
  async createStore(@Body() createStoreDto: CreateStoreDto) {
    const store = await this.storesService.create(createStoreDto);
    return plainToInstance(StoreResponseDto, store);
  }

}