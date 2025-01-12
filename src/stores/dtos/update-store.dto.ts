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
    type?: string;

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
    takeOutInStore?: true;

    @IsNumber()
    @IsOptional()
    shippingTimeInDays?: number;
}