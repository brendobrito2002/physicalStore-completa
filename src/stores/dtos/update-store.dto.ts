import { IsEmail, IsString, IsOptional, IsBoolean, IsNumber } from "class-validator";

export class UpdateStoreDto {
    @IsString()
    @IsOptional()
    storeName?: string;

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
    @IsOptional()
    type?: string; // PDV | LOJA

    @IsString()
    @IsOptional()
    country?: string;

    @IsString()
    @IsOptional()
    postalCode?: string;

    @IsString()
    @IsOptional()
    telephoneNumber?: string;

    @IsEmail()
    @IsOptional()
    emailAddress?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsBoolean()
    @IsOptional()
    takeOutInStore?: true; // sempre tem produto

    @IsNumber()
    @IsOptional()
    shippingTimeInDays?: number; // considerar tempo de preparo
}