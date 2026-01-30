import {Column, CreateDateColumn, Entity, PrimaryColumn} from 'typeorm';
import {ulid} from 'ulid';
import {ApiProperty} from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity()
export class Credential {
    @ApiProperty({ description: 'Identifiant unique du credential', example: '01HZJ8K9M2N3P4Q5R6S7T8U9V' })
    @PrimaryColumn('varchar', { length:26, default: () => `'${ulid()}'` })
    credential_id: string;
    
    @ApiProperty({ description: 'Nom d\'utilisateur', example: 'john.doe' })
    @Column({nullable: false, unique: true})
    username: string;
    
    @ApiProperty({ description: 'Mot de passe hashé', example: '$2b$10$...', required: false })
    @Exclude({ toPlainOnly: true })
    @Column({nullable: true})
    password: string;
    
    @ApiProperty({ description: 'Adresse email', example: 'john.doe@example.com' })
    @Column({nullable: false, unique: true})
    mail: string;
    
    @ApiProperty({ description: 'Hash Facebook pour connexion sociale', required: false })
    @Column({nullable: true, unique: false})
    facebookHash: string;
    
    @ApiProperty({ description: 'Hash Google pour connexion sociale', required: false })
    @Column({nullable: true, unique: false})
    googleHash: string;
    
    @ApiProperty({ description: 'Indique si l\'utilisateur est administrateur', example: false })
    @Column({default:false})
    isAdmin:boolean;
    
    @ApiProperty({ description: 'Indique si le compte est actif', example: true })
    @Column({default: true})
    active: boolean;
    
    @ApiProperty({ description: 'Date de création du compte' })
    @CreateDateColumn()
    created: Date;
    
    @ApiProperty({ description: 'Date de dernière mise à jour' })
    @CreateDateColumn()
    updated: Date;
}