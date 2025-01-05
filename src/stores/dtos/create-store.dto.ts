import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateStoreDto {
    @IsString()
    storeName: string;

    @IsString()
    city: string;

    @IsString()
    district: string; // bairro

    @IsString()
    state: string;

    @IsString()
    type: string; // PDV | Loja

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