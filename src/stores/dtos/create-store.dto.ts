import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateStoreDto {
    @IsString()
    @ApiProperty({description: 'Noma da loja', example: 'Loja Americanas'})
    storeName: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({description: 'Cidade da loja', example: 'Garanhuns'})
    city?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({description: 'Bairro da loja', example: 'Heliópolis'})
    district?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({description: 'Estado da loja', example: 'Pernambuco'})
    state?: string;

    @IsString()
    @ApiProperty({description: 'Tipo da loja', example: 'LOJA ou PDV'})
    type: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({description: 'Pais da loja', example: 'Brasil'})
    country?: string;

    @IsString()
    @ApiProperty({description: 'CEP da loja', example: '55296030'})
    postalCode: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'Número de telefone da loja', example: '+55 87 99999-9999' })
    telephoneNumber?: string;

    @IsEmail()
    @IsOptional()
    @ApiPropertyOptional({ description: 'Endereço de e-mail da loja', example: 'contato@loja.com' })
    emailAddress?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'Latitude da loja', example: '-8.8939471' })
    latitude?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'Longitude da loja', example: '-36.4887185' })
    longitude?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'Endereço da loja', example: 'Rua Olavo Bilac' })
    address?: string;

    @IsBoolean()
    @IsOptional()
    @ApiPropertyOptional({ description: 'Indica se a loja oferece retirada local', example: true })
    takeOutInStore?: true;

    @IsNumber()
    @ApiProperty({ description: 'Tempo estimado de envio (em dias)', example: 3 })
    shippingTimeInDays: number;
}