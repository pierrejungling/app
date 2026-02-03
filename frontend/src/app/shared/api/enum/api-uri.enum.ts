export enum ApiURI {
  SIGN_IN = 'account/signin',
  ADMIN_SIGN_IN = 'account/admin-signin',
  SIGN_UP = 'account/signup',
  ME = 'account/me',
  REFRESH_TOKEN = 'account/refresh',
  AJOUTER_COMMANDE = 'commande/ajouter',
  LISTE_COMMANDES = 'commande/liste',
  UPDATE_STATUT_COMMANDE = 'commande/statut',
  GET_COMMANDE_BY_ID = 'commande',
  UPDATE_COMMANDE = 'commande',
  DELETE_COMMANDE = 'commande',
}

/** URL pour l’upload d’un fichier sur une commande (remplacer :id par id_commande). */
export const COMMANDE_FICHIERS_UPLOAD = (idCommande: string) => `commande/${idCommande}/fichiers`;
/** URL pour la liste des fichiers d'une commande. */
export const COMMANDE_FICHIERS_LIST = (idCommande: string) => `commande/${idCommande}/fichiers`;
/** URL pour le téléchargement d'un fichier. */
export const COMMANDE_FICHIER_DOWNLOAD = (idCommande: string, idFichier: string) => `commande/${idCommande}/fichiers/${idFichier}/download`;
