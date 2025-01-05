import { IsEmail, IsString, IsOptional, IsBoolean, IsNumber } from "class-validator";

export class UpdateStoreDto {
    @IsString()
    @IsOptional()
    storeName: string;

    @IsString()
    @IsOptional()
    city: string;

    @IsString()
    @IsOptional()
    district: string; // bairro

    @IsString()
    @IsOptional()
    state: string;

    @IsString()
    @IsOptional()
    type: string; // PDV | Loja

    @IsString()
    @IsOptional()
    country: string;

    @IsString()
    @IsOptional()
    postalCode: string;

    @IsString()
    @IsOptional()
    teleponeNumber: string;

    @IsEmail()
    @IsOptional()
    emailAddress: string;

    @IsString()
    @IsOptional()
    latitude: string;

    @IsString()
    @IsOptional()
    longitude: string;

    @IsString()
    @IsOptional()
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
    @IsOptional()
    shippingTimeInDays: number; // considerar tempo de preparo
}