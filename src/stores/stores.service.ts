import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './stores.entity';
import { CreateStoreDto } from './dtos/create-store.dto';
import { ViaCepService } from 'src/services/viacep/viacep.service';
import { GeocodingService } from 'src/services/geocoding/geocoding.service';

@Injectable()
export class StoresService {
    constructor(
        @InjectRepository(Store) private repo: Repository<Store>,
        private viaCepService: ViaCepService,
        private geocodingService: GeocodingService
    ){}

    async create(storeDto: CreateStoreDto): Promise<Store> {

        if(storeDto.postalCode){
            const address = await this.viaCepService.getAddressByCep(storeDto.postalCode);
            
            if(address){
                storeDto.city = address.city,
                storeDto.district = address.district,
                storeDto.state = address.state,
                storeDto.address1 = address.address1
            }

            const coordinates = await this.geocodingService.getCoordinates(storeDto.postalCode, storeDto.address1, storeDto.country);

            if(coordinates){
                storeDto.latitude = coordinates.latitude;
                storeDto.longitude = coordinates.longitude;
            }
        }

        const store = this.repo.create(storeDto);
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
            throw new NotFoundException(`Loja com ID ${storeId} não encontrada`);
        }

        if(attrs.postalCode){
            const address = await this.viaCepService.getAddressByCep(attrs.postalCode);

            if(address){
                attrs.city = address.city,
                attrs.district = address.district,
                attrs.state = address.state,
                attrs.address1 = address.address1
            }

            const coordinates = await this.geocodingService.getCoordinates(attrs.postalCode, attrs.address1, attrs.country);

            if(coordinates){
                attrs.latitude = coordinates.latitude;
                attrs.longitude = coordinates.longitude;
            }
        }

        Object.assign(store, attrs);
        return this.repo.save(store);
    }

    async remove(storeId: string) { 
        const store = await this.findOneById(storeId); 
        
        if (!store) { 
            throw new NotFoundException(`Loja com ID ${storeId} não encontrada`); 
        } 
        
        return this.repo.remove(store); 
    }
}
