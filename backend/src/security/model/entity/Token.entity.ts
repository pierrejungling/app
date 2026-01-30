import {Column, Entity, JoinColumn, OneToOne, PrimaryColumn} from 'typeorm';
import {Credential} from './Credential.entity';
import {ulid} from 'ulid';
import {ApiProperty} from '@nestjs/swagger';

@Entity()
export class Token {
    @ApiProperty({ description: 'Identifiant unique du token', example: '01HZJ8K9M2N3P4Q5R6S7T8U9V' })
    @PrimaryColumn('varchar', { length:26, default: () => `'${ulid()}'` })
    token_id: string;
    
    @ApiProperty({ description: 'Token d\'accès JWT', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    @Column({nullable: false})
    token: string;
    
    @ApiProperty({ description: 'Token de rafraîchissement JWT', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    @Column({nullable: false})
    refreshToken: string;

    @ApiProperty({ description: 'Credential associé au token', type: () => Credential })
    @OneToOne(() => Credential,{eager:true})
    @JoinColumn({name: 'credential_id'})
    credential: Credential
}