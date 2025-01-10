import { Expose } from 'class-transformer';

export class StoreResponseDto {
  @Expose()
  storeID: string;

  @Expose()
  storeName: string;

  @Expose()
  city: string;

  @Expose()
  district: string;

  @Expose()
  state: string;

  @Expose()
  type: string;

  @Expose()
  country: string;

  @Expose()
  postalCode: string;

  @Expose()
  telephoneNumber: string;

  @Expose()
  emailAddress: string;

  @Expose()
  latitude: string;

  @Expose()
  longitude: string;

  @Expose()
  address: string;

  @Expose()
  takeOutInStore: true;

  @Expose()
  shippingTimeInDays: number;
}