import { IsEmail, IsString, IsOptional, IsNumber } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateStoreDto {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({description: 'Noma da loja', example: 'Loja Americanas'})
    storeName?: string;

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
    @IsOptional()
    @ApiPropertyOptional({description: 'Tipo da loja', example: 'LOJA ou PDV'})
    type?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({description: 'País da loja', example: 'Brasil'})
    country?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({description: 'CEP da loja', example: '55296030'})
    postalCode?: string;

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
    @ApiPropertyOptional({ description: 'Endereço da loja', example: 'Rua Olavo Bilac' })
    address?: string;

    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({ description: 'Tempo estimado de envio (em dias)', example: 3 })
    shippingTimeInDays?: number;
}