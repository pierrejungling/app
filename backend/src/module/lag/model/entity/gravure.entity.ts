import { Column, PrimaryColumn, Entity, ManyToOne, JoinColumn } from "typeorm";
import { ulid } from "ulid";
import { Commande } from "./commande.entity";


@Entity()
export class Gravure {
    @PrimaryColumn('varchar', { length:26, default: () => `'${ulid()}'` })
    id_gravure : string;

    @Column({type: 'timestamp', nullable: false})
    date_gravure: Date;
    

    @ManyToOne(() => Commande, (commande) => commande.id_commande)
    @JoinColumn({name: 'id_commande'})
    commande: Commande;
}