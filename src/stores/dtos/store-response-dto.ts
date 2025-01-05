import { Exclude, Expose, Transform } from 'class-transformer';

export class StoreResponseDto {
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
  teleponeNumber: string;

  @Expose()
  emailAddress: string;

  @Expose()
  latitude: string;

  @Expose()
  longitude: string;

  @Expose()
  address1: string;

  @Expose({ toPlainOnly: true })
  @Transform(({ value }) => (value !== null ? value : undefined))
  address2: string | null;

  @Expose({ toPlainOnly: true })
  @Transform(({ value }) => (value !== null ? value : undefined))
  address3: string | null;

  @Expose()
  takeOutInStore: boolean;

  @Expose()
  shippingTimeInDays: number;

  @Expose() // @Exclude()
  storeId: string;
}