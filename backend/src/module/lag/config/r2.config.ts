/**
 * Configuration R2 (Cloudflare). Lue depuis les variables d'environnement.
 * Ne pas ajouter aux configMinimalKeys pour que l'app démarre sans R2.
 * Créer un token R2 dans Cloudflare : R2 > Manage R2 API Tokens.
 */
function getR2Config(): {
    accountId: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucket: string;
    endpoint: string;
} {
    const accountId = process.env.R2_ACCOUNT_ID || '';
    const accessKeyId = process.env.R2_ACCESS_KEY_ID || '';
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '';
    const bucket = process.env.R2_BUCKET_NAME || '';
    const endpoint = accountId
        ? `https://${accountId}.r2.cloudflarestorage.com`
        : '';
    return { accountId, accessKeyId, secretAccessKey, bucket, endpoint };
}

export function isR2Configured(): boolean {
    const c = getR2Config();
    return !!(c.accountId && c.accessKeyId && c.secretAccessKey && c.bucket);
}

export function getR2ConfigOrThrow(): ReturnType<typeof getR2Config> {
    const c = getR2Config();
    if (!c.accountId || !c.accessKeyId || !c.secretAccessKey || !c.bucket) {
        throw new Error(
            'R2 non configuré : définir R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME',
        );
    }
    return c;
}
