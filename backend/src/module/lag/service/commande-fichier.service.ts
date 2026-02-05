import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommandeFichier } from '../model/entity/commande_fichier.entity';
import { Commande } from '../model/entity/commande.entity';
import { R2Service } from './r2.service';
import { ulid } from 'ulid';
import { Readable } from 'stream';

const PREFIX = 'commandes';

function sanitizeFileName(name: string): string {
    return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 200);
}

@Injectable()
export class CommandeFichierService {
    constructor(
        @InjectRepository(CommandeFichier)
        private readonly fichierRepository: Repository<CommandeFichier>,
        @InjectRepository(Commande)
        private readonly commandeRepository: Repository<Commande>,
        private readonly r2Service: R2Service,
    ) {}

    async listByCommande(idCommande: string): Promise<CommandeFichier[]> {
        const commande = await this.commandeRepository.findOne({
            where: { id_commande: idCommande },
        });
        if (!commande) {
            throw new NotFoundException('Commande non trouvée');
        }
        return this.fichierRepository.find({
            where: { commande: { id_commande: idCommande } },
            order: { date_upload: 'DESC' },
        });
    }

    async upload(
        idCommande: string,
        file: Express.Multer.File,
    ): Promise<CommandeFichier> {
        const commande = await this.commandeRepository.findOne({
            where: { id_commande: idCommande },
        });
        if (!commande) {
            throw new NotFoundException('Commande non trouvée');
        }
        const idFichier = ulid();
        const nomSanitized = sanitizeFileName(file.originalname || 'fichier');
        const keyR2 = `${PREFIX}/${idCommande}/${idFichier}_${nomSanitized}`;

        await this.r2Service.upload(
            keyR2,
            file.buffer,
            file.mimetype || 'application/octet-stream',
        );

        const fichier = new CommandeFichier();
        fichier.id_fichier = idFichier;
        fichier.key_r2 = keyR2;
        fichier.nom_fichier = file.originalname || 'fichier';
        fichier.type_mime = file.mimetype || null;
        fichier.taille_octets = file.size ?? null;
        fichier.date_upload = new Date();
        fichier.commande = commande;

        return this.fichierRepository.save(fichier);
    }

    async getStream(
        idCommande: string,
        idFichier: string,
    ): Promise<{ stream: import('stream').Readable; contentType?: string; nomFichier: string }> {
        const fichier = await this.fichierRepository.findOne({
            where: {
                id_fichier: idFichier,
                commande: { id_commande: idCommande },
            },
        });
        if (!fichier) {
            throw new NotFoundException('Fichier non trouvé');
        }
        const { stream, contentType } = await this.r2Service.getStream(fichier.key_r2);
        return { stream, contentType, nomFichier: fichier.nom_fichier };
    }

    async delete(idCommande: string, idFichier: string): Promise<void> {
        const fichier = await this.fichierRepository.findOne({
            where: {
                id_fichier: idFichier,
                commande: { id_commande: idCommande },
            },
        });
        if (!fichier) {
            throw new NotFoundException('Fichier non trouvé');
        }
        await this.r2Service.delete(fichier.key_r2);
        await this.fichierRepository.remove(fichier);
    }

    /** Supprime tous les fichiers d'une commande (R2 + DB). À appeler avant de supprimer la commande. */
    async deleteAllByCommande(idCommande: string): Promise<void> {
        const fichiers = await this.fichierRepository.find({
            where: { commande: { id_commande: idCommande } },
        });
        for (const f of fichiers) {
            await this.r2Service.delete(f.key_r2);
            await this.fichierRepository.remove(f);
        }
    }

    /** Duplique tous les fichiers d'une commande vers une autre. */
    async duplicateForCommande(sourceCommandeId: string, targetCommandeId: string): Promise<void> {
        const targetCommande = await this.commandeRepository.findOne({
            where: { id_commande: targetCommandeId },
        });
        if (!targetCommande) {
            throw new NotFoundException('Commande cible non trouvée');
        }

        const fichiers = await this.fichierRepository.find({
            where: { commande: { id_commande: sourceCommandeId } },
        });

        for (const f of fichiers) {
            const { stream, contentType } = await this.r2Service.getStream(f.key_r2);
            const buffer = await this.streamToBuffer(stream);
            const idFichier = ulid();
            const nomSanitized = sanitizeFileName(f.nom_fichier || 'fichier');
            const keyR2 = `${PREFIX}/${targetCommandeId}/${idFichier}_${nomSanitized}`;

            await this.r2Service.upload(
                keyR2,
                buffer,
                f.type_mime || contentType || 'application/octet-stream',
            );

            const fichier = new CommandeFichier();
            fichier.id_fichier = idFichier;
            fichier.key_r2 = keyR2;
            fichier.nom_fichier = f.nom_fichier;
            fichier.type_mime = f.type_mime;
            fichier.taille_octets = f.taille_octets ?? buffer.length;
            fichier.date_upload = new Date();
            fichier.commande = targetCommande;

            await this.fichierRepository.save(fichier);
        }
    }

    private async streamToBuffer(stream: Readable): Promise<Buffer> {
        const chunks: Buffer[] = [];
        for await (const chunk of stream) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }
        return Buffer.concat(chunks);
    }
}
