import { Test, TestingModule } from '@nestjs/testing';
import { StoresService } from './stores.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Store } from './stores.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateStoreDto } from './dtos/create-store.dto';
import { DistanceMatrixService } from './../services/distance-matrix/distance-matrix.service';
import { GeocodingService } from './../services/geocoding/geocoding.service';
import { AddressCoordinatesService } from './utils/address-coordinates.service';
import { DeliveryOptionsService } from './utils/delivery-options.service';
import { StoreType } from './constants/store.constants';

describe('StoresService', () => {
  let service: StoresService;
  let repository: Repository<Store>;
  const mockStore = { storeID: '1', storeName: 'Test Store', type: StoreType.LOJA, postalCode: '01001000', shippingTimeInDays: 3 } as Store;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoresService,
        {
          provide: getRepositoryToken(Store),
          useClass: Repository,
        },
        { provide: GeocodingService, useValue: { getCoordinates: jest.fn() } },
        { provide: DistanceMatrixService, useValue: { calculateDistance: jest.fn() } },
        { provide: AddressCoordinatesService, useValue: { enrichAddress: jest.fn() } },
        { provide: DeliveryOptionsService, useValue: { calculateDeliveryOptions: jest.fn() } },
      ],
    }).compile();

    service = module.get<StoresService>(StoresService);
    repository = module.get<Repository<Store>>(getRepositoryToken(Store));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a store', async () => {
      const createStoreDto: CreateStoreDto = {
        storeName: 'New Store',
        type: StoreType.LOJA,
        postalCode: '01001000',
        shippingTimeInDays: 3,
      };
      const savedStore = { ...createStoreDto, storeID: '1' };
      jest.spyOn(repository, 'create').mockReturnValue(savedStore as Store);
      jest.spyOn(repository, 'save').mockResolvedValue(savedStore as Store);

      const result = await service.create(createStoreDto);

      expect(repository.create).toHaveBeenCalledWith(createStoreDto);
      expect(repository.save).toHaveBeenCalledWith(savedStore);
      expect(result).toEqual(savedStore);
    });

    it('should throw an error if type is invalid', async () => {
      const invalidDto: CreateStoreDto = {
        storeName: 'Invalid Store',
        type: 'INVALID' as StoreType,
        postalCode: '01001000',
        shippingTimeInDays: 3,
      };

      await expect(service.create(invalidDto)).rejects.toThrow(
        `A loja deve ser do tipo ${StoreType.LOJA} ou ${StoreType.PDV}`
      );
    });
  });

  describe('findAll', () => {
    it('should return all stores', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([mockStore]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual([mockStore]);
    });
  });

  describe('findOneById', () => {
    it('should return a store by ID', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockStore);

      const result = await service.findOneById('1');

      expect(repository.findOneBy).toHaveBeenCalledWith({ storeID: '1' });
      expect(result).toEqual(mockStore);
    });

    it('should return null if store not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      const result = await service.findOneById('1');

      expect(result).toBeNull();
    });
  });

  describe('findAllStoreByState', () => {
    it('should return all stores for a given state', async () => {
      const state = 'Pernambuco';
      const stores = [
        { storeID: '1', storeName: 'Loja 1', state: 'Pernambuco' },
        { storeID: '2', storeName: 'Loja 2', state: 'São Paulo' },
      ] as Store[];
  
      jest.spyOn(repository, 'find').mockResolvedValue(stores);
  
      const result = await service.findAllStoreByState(state);
  
      expect(repository.find).toHaveBeenCalledWith({ where: { state } });
      expect(result).toEqual(stores);
    });
  
    it('should return an empty array if no stores are found for the state', async () => {
      const state = 'Rio de Janeiro';
  
      jest.spyOn(repository, 'find').mockResolvedValue([]);
  
      const result = await service.findAllStoreByState(state);
  
      expect(repository.find).toHaveBeenCalledWith({ where: { state } });
      expect(result).toEqual([]);
    });
  });  

  describe('update', () => {
    it('should update a store', async () => {
      const updatedAttrs = { storeName: 'Updated Store' };
      const updatedStore = { 
        ...mockStore, 
        ...updatedAttrs
      };
  
      jest.spyOn(service, 'findOneById').mockResolvedValue(mockStore);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedStore);
  
      const result = await service.update('1', updatedAttrs);
  
      expect(service.findOneById).toHaveBeenCalledWith('1');
      expect(repository.save).toHaveBeenCalledWith(updatedStore);
      expect(result).toEqual(updatedStore);
    });
  
    it('should throw NotFoundException if store not found', async () => {
      jest.spyOn(service, 'findOneById').mockResolvedValue(null);
  
      await expect(service.update('1', {})).rejects.toThrow(NotFoundException);
    });
  });
  
  describe('remove', () => {
    it('should remove a store by ID', async () => {
      const storeID = '2';
      const store = {
        storeID,
        storeName: 'Loja de Teste',
      } as Store;
    
      jest.spyOn(service, 'findOneById').mockResolvedValue(store);
      jest.spyOn(repository, 'remove').mockResolvedValue(store);
    
      const result = await service.remove(storeID);
    
      expect(service.findOneById).toHaveBeenCalledWith(storeID);
      expect(repository.remove).toHaveBeenCalledWith(store);
      expect(result).toEqual(store);
    });
    
    it('should throw an error if store to be removed is not found', async () => {
      const storeID = '2';
    
      jest.spyOn(service, 'findOneById').mockResolvedValue(null);
    
      await expect(service.remove(storeID)).rejects.toThrow(
        new NotFoundException(`Loja com ID ${storeID} não encontrada`),
      );
    })
  });
  
  describe('storeByCep', () => {
    it('should return stores and pins for a given postal code', async () => {
      const postalCode = '01001000';
      const originCoordinates = { latitude: '-23.5503099', longitude: '-46.6342009' };
      const stores = [
        {
          storeID: '1',
          storeName: 'Loja 1',
          latitude: '-23.5503099',
          longitude: '-46.6342009',
          postalCode: '01001000',
          type: 'LOJA',
        },
        {
          storeID: '2',
          storeName: 'Loja 2',
          latitude: '-23.5486343',
          longitude: '-46.6347912',
          postalCode: '01002000',
          type: 'PDV',
        },
      ] as Store[];
  
      jest
        .spyOn(service['geocodingService'], 'getCoordinates')
        .mockResolvedValue(originCoordinates);
      jest
        .spyOn(service['deliveryOptionsService'], 'calculateDeliveryOptions')
        .mockResolvedValue([{ deliveryCost: 10 }]);
      jest
        .spyOn(service['distanceService'], 'calculateDistance')
        .mockResolvedValue(5);
      jest.spyOn(service, 'findAll').mockResolvedValue(stores);
  
      const result = await service.storeByCep(postalCode);
  
      expect(service['geocodingService'].getCoordinates).toHaveBeenCalledWith(
        postalCode,
      );
      expect(service['deliveryOptionsService'].calculateDeliveryOptions).toHaveBeenCalled();
      expect(service['distanceService'].calculateDistance).toHaveBeenCalled();
      expect(result.stores).toHaveLength(2);
      expect(result.pins).toHaveLength(3);
    });
  
    it('should return an empty list if no stores are found', async () => {
      const postalCode = '01001000';
      const originCoordinates = { latitude: '-23.5503099', longitude: '-46.6342009' };
  
      jest
        .spyOn(service['geocodingService'], 'getCoordinates')
        .mockResolvedValue(originCoordinates);
      jest.spyOn(service, 'findAll').mockResolvedValue([]);
  
      const result = await service.storeByCep(postalCode);
  
      expect(result.stores).toHaveLength(0);
      expect(result.pins).toHaveLength(1);
    });
  });  
});
