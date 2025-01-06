import { IsEmail, IsString, IsOptional, IsBoolean, IsNumber, IsEnum } from "class-validator";
import { StoreType } from "../stores.entity";

export class UpdateStoreDto {
    @IsString()
    @IsOptional()
    storeName?: string;

    @IsString()
    @IsOptional()
    city?: string;

    @IsString()
    @IsOptional()
    district?: string; // bairro

    @IsString()
    @IsOptional()
    state?: string;

    @IsString()
    @IsEnum(StoreType, { message: 'O tipo deve ser PDV ou Loja' })
    @IsOptional()
    type?: StoreType; // PDV | Loja

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
    latitude?: string;

    @IsString()
    @IsOptional()
    longitude?: string;

    @IsString()
    @IsOptional()
    address1?: string;

    @IsOptional()
    @IsString()
    address2?: string;

    @IsOptional()
    @IsString()
    address3?: string;

    @IsBoolean()
    @IsOptional()
    takeOutInStore?: boolean; // sempre tem produto

    @IsNumber()
    @IsOptional()
    shippingTimeInDays?: number; // considerar tempo de preparo
}