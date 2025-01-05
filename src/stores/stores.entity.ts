import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { IsString, IsBoolean, IsNumber, IsEmail } from "class-validator";

@Entity()
export class Store {
    @IsString()
    @PrimaryGeneratedColumn()
    storeId: string;

    @IsString()
    @Column()
    storeName: string;

    @IsString()
    @Column()
    city: string;

    @IsString()
    @Column()
    district: string; // bairro

    @IsString()
    @Column()
    state: string;

    @IsString()
    @Column()
    type: string; // PDV | Loja

    @IsString()
    @Column()
    country: string;

    @IsString()
    @Column()
    postalCode: string;

    @IsString()
    @Column()
    teleponeNumber: string;

    @IsEmail()
    @Column()
    emailAddress: string;

    @IsString()
    @Column("decimal")
    latitude: string;

    @IsString()
    @Column("decimal")
    longitude: string;

    @IsString()
    @Column()
    address1: string;

    @IsString()
    @Column({ nullable: true })
    address2: string;

    @IsString()
    @Column({ nullable: true })
    address3: string;

    @IsBoolean()
    @Column({ default: true })
    takeOutInStore: boolean; // sempre tem produto

    @IsNumber()
    @Column("int")
    shippingTimeInDays: number; // considerar tempo de preparo
}
