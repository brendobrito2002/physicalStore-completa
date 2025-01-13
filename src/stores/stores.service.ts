import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './stores.entity';
import { CreateStoreDto } from './dtos/create-store.dto';
import { GeocodingService } from './../services/geocoding/geocoding.service';
import { DistanceMatrixService } from './../services/distance-matrix/distance-matrix.service';
import { StoreType } from './../stores/constants/store.constants';
import { AddressCoordinatesService } from './utils/address-coordinates.service';
import { DeliveryOptionsService } from './utils/delivery-options.service';

@Injectable()
export class StoresService {
    static geocodingService(geocodingService: any, arg1: string) {
      throw new Error('Method not implemented.');
    }
    constructor(
        @InjectRepository(Store) private repo: Repository<Store>,
        public geocodingService: GeocodingService,
        public distanceService: DistanceMatrixService,
        public addressCoordinatesService: AddressCoordinatesService,
        public deliveryOptionsService: DeliveryOptionsService
    ) { }

    async create(storeDto: CreateStoreDto): Promise<Store> {
        if (storeDto.type !== StoreType.LOJA && storeDto.type !== StoreType.PDV) {
            throw new Error(`A loja deve ser do tipo ${StoreType.LOJA} ou ${StoreType.PDV}`);
        }

        if (storeDto.postalCode) {
            const enrichedData = await this.addressCoordinatesService.enrichAddress(
                storeDto.postalCode,
                storeDto.address,
                storeDto.country,
            );
            Object.assign(storeDto, enrichedData);
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
        return this.repo.find({ where: { state: state } });
    }

    async update(storeID: string, attrs: Partial<Store>) {
        const store = await this.findOneById(storeID);

        if (!store) {
            throw new NotFoundException(`Loja com ID ${storeID} não encontrada`);
        }

        if (attrs.postalCode) {
            const enrichedData = await this.addressCoordinatesService.enrichAddress(
                attrs.postalCode,
                attrs.address,
                attrs.country,
            );
            Object.assign(attrs, enrichedData);
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
                    const deliveryOptions = await this.deliveryOptionsService.calculateDeliveryOptions(
                        store.type,
                        originCoordinates.latitude,
                        originCoordinates.longitude,
                        store.latitude,
                        store.longitude,
                        store.postalCode,
                        postalCode,
                    );

                    const distance = await this.distanceService.calculateDistance(
                        originCoordinates.latitude,
                        originCoordinates.longitude,
                        store.latitude,
                        store.longitude,
                    );

                    return {
                        storeData: {
                            name: store.storeName,
                            city: store.city,
                            postalCode: store.postalCode,
                            type: store.type,
                            distance: `${distance} km`,
                            value: deliveryOptions,
                        },
                        pin: {
                            position: { lat: store.latitude, lng: store.longitude },
                            title: store.storeName,
                        },
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
