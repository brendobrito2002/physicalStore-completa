import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, AfterUpdate, AfterRemove } from "typeorm";
import { IsString, IsBoolean, IsNumber, IsEmail } from "class-validator";

export enum StoreType {
    PDV = 'PDV',
    LOJA = 'Loja',
}

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
    @Column({ type: 'text' })
    type: StoreType;

    @IsString()
    @Column()
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
    address2: string | null;

    @IsString()
    @Column({ nullable: true })
    address3: string | null;

    @IsBoolean()
    @Column({ default: true })
    takeOutInStore: boolean; // sempre tem produto

    @IsNumber()
    @Column("int")
    shippingTimeInDays: number; // considerar tempo de preparo

    @AfterInsert()
    logInsert() {
        console.log('Inserido Loja com ID: ', this.storeId);
    }

    @AfterUpdate()
    logUpdate() {
        console.log('Atualizada Loja com ID: ', this.storeId);
    }

    @AfterRemove()
    logRemove() {
        console.log('Removida Loja com ID: ', this.storeId);
    }
}
