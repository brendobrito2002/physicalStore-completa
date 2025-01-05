import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Store {
    @PrimaryGeneratedColumn()
    storeId: string;

    @Column()
    storeName: string;

    @Column()
    city: string;

    @Column()
    district: string;

    @Column()
    state: string;

    @Column()
    type: string; // PDV | Loja

    @Column()
    country: string;

    @Column()
    postalCode: string;

    @Column()
    teleponeNumber: string;

    @Column()
    emailAddress: string;

    @Column()
    latitude: string;

    @Column()
    longitude: string;

    @Column()
    address1: string;

    @Column()
    address2: string;

    @Column()
    address3: string;

    @Column()
    takeOutInStore: boolean; // sempre tem produto

    @Column()
    shippingTimeInDays: number; // considerar tempo de preparo
}
