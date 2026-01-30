import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { StatutCommande } from '../../entity/enum';

export class UpdateStatutPayload {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    id_commande: string;

    @ApiProperty({ enum: StatutCommande })
    @IsNotEmpty()
    statut: StatutCommande;
}
