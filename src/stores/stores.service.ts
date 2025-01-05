import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './stores.entity';
import { CreateStoreDto } from './dtos/create-store.dto';

@Injectable()
export class StoresService {
    constructor(@InjectRepository(Store) private repo: Repository<Store>){}

    async create(createStoreDto: CreateStoreDto): Promise<Store> {
        const store = this.repo.create(createStoreDto);
        return this.repo.save(store);
    }

    async findAll(): Promise<Store[]> {
        return this.repo.find();
    }

    async findOneById(storeId: string): Promise<Store | null> {
        return this.repo.findOneBy({ storeId });
    }
    
}
