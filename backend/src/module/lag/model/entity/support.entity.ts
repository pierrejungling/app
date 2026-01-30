import { Column, PrimaryColumn, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ulid } from "ulid";
import { TypeMateriaux } from "./enum";
import { Gravure } from "./gravure.entity";


@Entity()
export class Support {
    @PrimaryColumn('varchar', { length:26, default: () => `'${ulid()}'` })
    id_support : string;

    @Column({type: 'varchar', nullable: false})
    nom_support: string;

    @Column({type: 'varchar', nullable: true})
    type_matériaux: TypeMateriaux | null;

    @Column({type: 'varchar', nullable: true})
    dimensions: string | null;

    @Column({type: 'decimal', nullable: true})
    prix_support: number | null;

    @Column({type: 'varchar', nullable: true})
    url_support: string | null;

    @ManyToOne(() => Gravure, (gravure) => gravure.id_gravure)
    @JoinColumn({name: 'id_gravure'})
    gravure: Gravure;

    
}