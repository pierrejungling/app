import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commande, Client, Gravure, Personnalisation, Support } from './model/entity';
import { CommandeService } from './service';
import { CommandeController } from './controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Commande, Client, Gravure, Personnalisation, Support])
    ],
    providers: [CommandeService],
    controllers: [CommandeController],
    exports: [CommandeService]
})
export class LagModule {}
