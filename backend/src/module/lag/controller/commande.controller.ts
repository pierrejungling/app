import { Controller, Post, Body, Get, Put, Delete, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommandeService } from '../service/commande.service';
import { AjouterCommandePayload, UpdateStatutPayload } from '../model/payload';

@ApiBearerAuth('access-token')
@ApiTags('Commande')
@Controller('commande')
export class CommandeController {
    constructor(private readonly commandeService: CommandeService) {}

    @Post('ajouter')
    @ApiOperation({ summary: 'Ajouter une nouvelle commande' })
    async ajouterCommande(@Body() payload: AjouterCommandePayload) {
        return await this.commandeService.ajouterCommande(payload);
    }

    @Get('liste')
    @ApiOperation({ summary: 'Récupérer toutes les commandes' })
    async getAllCommandes() {
        return await this.commandeService.getAllCommandes();
    }

    @Put('statut')
    @ApiOperation({ summary: 'Mettre à jour le statut d\'une commande' })
    async updateStatut(@Body() payload: UpdateStatutPayload) {
        return await this.commandeService.updateStatutCommande(payload.id_commande, payload.statut);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Récupérer une commande par son ID' })
    async getCommandeById(@Param('id') id: string) {
        return await this.commandeService.getCommandeById(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Mettre à jour une commande' })
    async updateCommande(@Param('id') id: string, @Body() payload: any) {
        return await this.commandeService.updateCommande(id, payload);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer une commande' })
    async deleteCommande(@Param('id') id: string) {
        return await this.commandeService.deleteCommande(id);
    }
}
