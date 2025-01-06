import { IsBoolean, IsEmail, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { StoreType } from "../stores.entity";

export class CreateStoreDto {
    @IsString()
    storeName: string;

    @IsString()
    city: string;

    @IsString()
    district: string; // bairro

    @IsString()
    state: string;

    @IsEnum(StoreType, { message: 'O tipo deve ser PDV ou Loja' })
    type: StoreType; // PDV | Loja

    @IsString()
    country: string;

    @IsString()
    postalCode: string;

    @IsString()
    teleponeNumber: string;

    @IsEmail()
    emailAddress: string;

    @IsString()
    latitude: string;

    @IsString()
    longitude: string;

    @IsString()
    address1: string;

    @IsOptional()
    @IsString()
    address2?: string;

    @IsOptional()
    @IsString()
    address3?: string;

    @IsBoolean()
    takeOutInStore: boolean; // sempre tem produto

    @IsNumber()
    shippingTimeInDays: number; // considerar tempo de preparo
}