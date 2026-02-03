import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commande, Client, Gravure, Personnalisation, Support, CommandeSupport, CommandeFichier } from './model/entity';
import { CommandeService, R2Service, CommandeFichierService } from './service';
import { CommandeController } from './controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Commande, Client, Gravure, Personnalisation, Support, CommandeSupport, CommandeFichier])
    ],
    providers: [CommandeService, R2Service, CommandeFichierService],
    controllers: [CommandeController],
    exports: [CommandeService]
})
export class LagModule {}
