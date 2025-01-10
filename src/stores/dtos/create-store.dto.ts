import { IsBoolean, IsEmail, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateStoreDto {
    @IsString()
    storeName: string;

    @IsString()
    @IsOptional()
    city?: string;

    @IsString()
    @IsOptional()
    district?: string;

    @IsString()
    @IsOptional()
    state?: string;

    @IsString()
    type: string; // PDV | LOJA

    @IsString()
    @IsOptional()
    country?: string;

    @IsString()
    postalCode: string;

    @IsString()
    @IsOptional()
    telephoneNumber?: string;

    @IsEmail()
    @IsOptional()
    emailAddress?: string;

    @IsString()
    @IsOptional()
    latitude?: string;

    @IsString()
    @IsOptional()
    longitude?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsBoolean()
    @IsOptional()
    takeOutInStore?: true; // sempre tem produto

    @IsNumber()
    shippingTimeInDays: number; // considerar tempo de preparo
}