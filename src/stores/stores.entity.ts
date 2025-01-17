import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { IsString, IsBoolean, IsNumber, IsEmail } from "class-validator";

@Entity()
export class Store {
    @IsString()
    @PrimaryGeneratedColumn()
    storeID: string;

    @IsString()
    @Column()
    storeName: string;

    @IsString()
    @Column()
    city: string;

    @IsString()
    @Column()
    district: string;

    @IsString()
    @Column()
    state: string;

    @IsString()
    @Column()
    type: string;

    @IsString()
    @Column({ default: 'Brasil' })
    country: string;

    @IsString()
    @Column()
    postalCode: string;

    @IsString()
    @Column()
    telephoneNumber: string;

    @IsEmail()
    @Column()
    emailAddress: string;

    @IsString()
    @Column({ nullable: true })
    latitude: string;

    @IsString()
    @Column({ nullable: true })
    longitude: string;

    @IsString()
    @Column()
    address: string;

    @IsBoolean()
    @Column({ default: true })
    takeOutInStore: boolean;

    @IsNumber()
    @Column("int")
    shippingTimeInDays: number;

}
