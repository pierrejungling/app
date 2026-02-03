import { Injectable } from '@nestjs/common';
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getR2ConfigOrThrow } from '../config/r2.config';
import { Readable } from 'stream';

@Injectable()
export class R2Service {
    private client: S3Client | null = null;
    private bucket: string = '';

    private getClient(): S3Client {
        if (!this.client) {
            const config = getR2ConfigOrThrow();
            this.bucket = config.bucket;
            this.client = new S3Client({
                region: 'auto',
                endpoint: config.endpoint,
                credentials: {
                    accessKeyId: config.accessKeyId,
                    secretAccessKey: config.secretAccessKey,
                },
            });
        }
        return this.client;
    }

    private getBucket(): string {
        if (!this.bucket) this.getClient();
        return this.bucket;
    }

    /**
     * Upload un fichier vers R2.
     * @returns la clé de l'objet dans le bucket (key_r2)
     */
    async upload(
        key: string,
        body: Buffer | Uint8Array,
        contentType?: string,
    ): Promise<string> {
        const client = this.getClient();
        const bucket = this.getBucket();
        await client.send(
            new PutObjectCommand({
                Bucket: bucket,
                Key: key,
                Body: body,
                ContentType: contentType || 'application/octet-stream',
            }),
        );
        return key;
    }

    /**
     * Récupère le flux du fichier depuis R2.
     */
    async getStream(key: string): Promise<{ stream: Readable; contentType?: string }> {
        const client = this.getClient();
        const bucket = this.getBucket();
        const response = await client.send(
            new GetObjectCommand({ Bucket: bucket, Key: key }),
        );
        if (!response.Body) {
            throw new Error('Fichier introuvable dans R2');
        }
        return {
            stream: response.Body as Readable,
            contentType: response.ContentType ?? undefined,
        };
    }

    /**
     * Supprime un objet dans R2.
     */
    async delete(key: string): Promise<void> {
        const client = this.getClient();
        const bucket = this.getBucket();
        await client.send(
            new DeleteObjectCommand({ Bucket: bucket, Key: key }),
        );
    }
}
