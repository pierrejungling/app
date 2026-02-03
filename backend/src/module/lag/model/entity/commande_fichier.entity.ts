import { Column, PrimaryColumn, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { ulid } from 'ulid';
import { Commande } from './commande.entity';

@Entity()
export class CommandeFichier {
    @PrimaryColumn('varchar', { length: 26, default: () => `'${ulid()}'` })
    id_fichier: string;

    /** Clé de l'objet dans le bucket R2 (ex: commandes/{id_commande}/{id_fichier}_{nom}) */
    @Column({ type: 'varchar', length: 512 })
    key_r2: string;

    /** Nom original du fichier (affichage et téléchargement) */
    @Column({ type: 'varchar', length: 255 })
    nom_fichier: string;

    /** Type MIME (ex: image/png, application/pdf) */
    @Column({ type: 'varchar', length: 128, nullable: true })
    type_mime: string | null;

    /** Taille en octets */
    @Column({ type: 'integer', nullable: true })
    taille_octets: number | null;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date_upload: Date;

    @ManyToOne(() => Commande, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_commande' })
    commande: Commande;
}
