import { IsBoolean, IsEmail, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { StoreType } from "../stores.entity";

export class CreateStoreDto {
    @IsString()
    storeName: string;

    @IsString()
    @IsOptional()
    city?: string;

    @IsString()
    @IsOptional()
    district?: string; // bairro

    @IsString()
    @IsOptional()
    state?: string;

    @IsEnum(StoreType, { message: 'O tipo deve ser PDV ou Loja' })
    type: StoreType; // PDV | Loja

    @IsString()
    @IsOptional()
    country?: string;

    @IsString()
    postalCode: string;

    @IsString()
    telephoneNumber: string;

    @IsEmail()
    emailAddress: string;

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
    shippingTimeInDays: number; // considerar tempo de preparo
}