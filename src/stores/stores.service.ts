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
    
    async update(storeId: string, attrs: Partial<Store>){
        const store = await this.findOneById(storeId);

        if(!store){
            throw new Error(`Loja com ID ${storeId} não encontrada`);
        }

        Object.assign(store, attrs);
        return this.repo.save(store);
    }

    async remove(storeId: string) { 
        const store = await this.findOneById(storeId); 
        
        if (!store) { 
            throw new Error(`Loja com ID ${storeId} não encontrada`); 
        } 
        
        return this.repo.remove(store); 
    }
}
