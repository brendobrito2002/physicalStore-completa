import { Injectable } from '@nestjs/common';
import { DistanceMatrixService } from '../../services/distance-matrix/distance-matrix.service';
import { CorreiosService } from '../../services/correios/correios.service';
import { StoreType, DEFAULT_SHIPPING_DIMENSIONS, DELIVERY_DISTANCE_LIMIT, DELIVERY_PRICE, DELIVERY_TIME, DELIVERY_METHOD } from '../../stores/constants/store.constants';

@Injectable()
export class DeliveryOptionsService {
    constructor(
        private distanceService: DistanceMatrixService,
        private correiosService: CorreiosService,
    ) { }

    async calculateDeliveryOptions(
        storeType: string,
        originLat: string,
        originLng: string,
        storeLat: string,
        storeLng: string,
        storePostalCode: string,
        originPostalCode: string,
    ): Promise<any[]> {
        const distance = await this.distanceService.calculateDistance(originLat, originLng, storeLat, storeLng);
        const distanceInKm = parseFloat(distance.toFixed(2));

        if (storeType === StoreType.PDV) {
            if (distanceInKm <= DELIVERY_DISTANCE_LIMIT) {
                return [{
                    prazo: DELIVERY_TIME,
                    price: DELIVERY_PRICE,
                    description: DELIVERY_METHOD,
                }];
            }
            return [{
                description: "Sem entrega disponível para distâncias acima de 50km",
            }];
        }

        if (storeType === StoreType.LOJA) {
            if (distanceInKm <= DELIVERY_DISTANCE_LIMIT) {
                return [{
                    prazo: DELIVERY_TIME,
                    price: DELIVERY_PRICE,
                    description: DELIVERY_METHOD,
                }];
            }

            return await this.correiosService.calculateShipping(
                originPostalCode,
                storePostalCode,
                DEFAULT_SHIPPING_DIMENSIONS.length,
                DEFAULT_SHIPPING_DIMENSIONS.width,
                DEFAULT_SHIPPING_DIMENSIONS.height,
            );
        }

        return [];
    }
}
