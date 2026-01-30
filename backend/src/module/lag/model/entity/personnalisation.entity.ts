import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { ulid } from "ulid";
import { Gravure } from "./gravure.entity";
import { Couleur } from "./enum";


@Entity()
export class Personnalisation {
    @PrimaryColumn('varchar', { length:26, default: () => `'${ulid()}'` })
    id_personnalisation : string;

    @Column({type: 'text', nullable: false})
    texte: string;

    @Column({type: 'varchar', nullable: true})
    police: string | null;

    @Column({type: 'varchar', nullable: true})
    fichier_source: string | null;

    @Column({type: 'text', nullable: true})
    informations_supplémentaires: string | null;

    @Column({type: 'simple-array', nullable: true})
    couleur: Couleur[] | null;

    @ManyToOne(() => Gravure, (gravure) => gravure.id_gravure)
    @JoinColumn({name: 'id_gravure'})
    gravure: Gravure;
}