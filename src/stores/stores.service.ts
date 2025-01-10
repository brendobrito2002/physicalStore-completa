import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './stores.entity';
import { CreateStoreDto } from './dtos/create-store.dto';
import { ViaCepService } from 'src/services/viacep/viacep.service';
import { GeocodingService } from 'src/services/geocoding/geocoding.service';
import { DistanceMatrixService } from 'src/services/distance-matrix.service.ts/distance-matrix.service.ts.service';
import { CorreiosService } from 'src/services/correios/correios.service';

@Injectable()
export class StoresService {
    constructor(
        @InjectRepository(Store) private repo: Repository<Store>,
        private viaCepService: ViaCepService,
        private geocodingService: GeocodingService,
        private distanceService: DistanceMatrixService,
        private correiosService: CorreiosService
    ){}

    async create(storeDto: CreateStoreDto): Promise<Store> {

        if(storeDto.type != 'LOJA' && storeDto.type != 'PDV'){
            throw new Error('A loja deve ser do tipo LOJA ou PDV');
        }

        if(storeDto.postalCode){
            const address = await this.viaCepService.getAddressByCep(storeDto.postalCode);
            
            if(address){
                storeDto.city = address.city,
                storeDto.district = address.district,
                storeDto.state = address.state,
                storeDto.address = address.address
            }

            const coordinates = await this.geocodingService.getCoordinates(storeDto.postalCode, storeDto.address, storeDto.country);

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

    async findOneById(storeID: string): Promise<Store | null> {
        return this.repo.findOneBy({ storeID });
    }

    async findAllStoreByState(state: string): Promise<Store[]> {
        return this.repo.find({ where: {state: state}});
    }
    
    async update(storeID: string, attrs: Partial<Store>){
        const store = await this.findOneById(storeID);

        if(!store){
            throw new NotFoundException(`Loja com ID ${storeID} não encontrada`);
        }

        if(attrs.postalCode){
            const address = await this.viaCepService.getAddressByCep(attrs.postalCode);

            if(address){
                attrs.city = address.city,
                attrs.district = address.district,
                attrs.state = address.state,
                attrs.address = address.address
            }

            const coordinates = await this.geocodingService.getCoordinates(attrs.postalCode, attrs.address, attrs.country);

            if(coordinates){
                attrs.latitude = coordinates.latitude;
                attrs.longitude = coordinates.longitude;
            }
        }

        Object.assign(store, attrs);
        return this.repo.save(store);
    }

    async remove(storeID: string) { 
        const store = await this.findOneById(storeID); 
        
        if (!store) { 
            throw new NotFoundException(`Loja com ID ${storeID} não encontrada`); 
        } 
        
        return this.repo.remove(store); 
    }

    async storeByCep(postalCode: string): Promise<any> {
        const originCoordinates = await this.geocodingService.getCoordinates(postalCode);
    
        if (!originCoordinates) {
            throw new NotFoundException(`CEP ${postalCode} não encontrado ou inválido`);
        }
    
        const stores = await this.findAll();
    
        const storeResponses = await Promise.all(
            stores.map(async (store) => {
                try {
                    const distance = await this.distanceService.calculateDistance(
                        originCoordinates.latitude,
                        originCoordinates.longitude,
                        store.latitude,
                        store.longitude,
                    );
    
                    const distanceInKm = parseFloat(distance.toFixed(2));
    
                    const pin = {
                        position: { lat: store.latitude, lng: store.longitude },
                        title: store.storeName,
                    };
    
                    let deliveryOptions: any[] = [];
    
                    if (store.type === 'PDV') {
                        if (distanceInKm <= 50) {
                            deliveryOptions.push({
                                prazo: "1 dia(s) úteis",
                                price: "R$ 15,00",
                                description: "Motoboy",
                            });
                        } else {
                            deliveryOptions.push({
                                description: "Sem entrega disponível para distâncias acima de 50km",
                            });
                        }
                    } else if (store.type === 'LOJA') {
                        if (distanceInKm <= 50) {
                            deliveryOptions.push({
                                prazo: "1 dia(s) úteis",
                                price: "R$ 15,00",
                                description: "Motoboy",
                            });
                        } else {
                            const shippingOptions = await this.correiosService.calculateShipping(
                                postalCode,
                                store.postalCode,
                                "20",
                                "15",
                                "10"
                            );
                            deliveryOptions = shippingOptions;
                        }
                    }
    
                    return {
                        storeData: {
                            name: store.storeName,
                            city: store.city,
                            postalCode: store.postalCode,
                            type: store.type,
                            distance: `${distanceInKm} km`,
                            value: deliveryOptions,
                        },
                        pin,
                    };
                } catch (error) {
                    console.error(`Erro ao processar loja ${store.storeName}: ${error.message}`);
                    return null;
                }
            })
        );
    
        const validStores = storeResponses.filter((response) => response !== null);
    
        const pins = validStores.map((store) => store.pin);
        pins.push({
            position: { lat: originCoordinates.latitude, lng: originCoordinates.longitude },
            title: `Origem: ${postalCode}`,
        });
    
        return {
            stores: validStores.map((store) => store.storeData),
            pins,
        };
    }
}    
