export interface CoordonneesContact {
  nom: string;
  prenom: string;
  telephone: string;
  mail: string;
  adresse?: string;
  tva?: string;
}

export interface AjouterCommandePayload {
  nom_commande: string;
  deadline: string;
  coordonnees_contact: CoordonneesContact;
  description_projet?: string;
  dimensions_souhaitees?: string;
  couleur?: string[];
  support?: string;
  police_ecriture?: string;
  texte_personnalisation?: string;
  fichiers_joints?: string[];
}

export enum Couleur {
  NOIR = 'noir',
  NATUREL = 'naturel',
  LASURE = 'lasuré',
  OR = 'or',
  ARGENT = 'argent',
  BLANC = 'blanc',
  GRAVURE_PEINTE = 'gravure peinte'
}

export enum StatutCommande {
  EN_ATTENTE_INFORMATION = 'en_attente_information',
  A_MODELLISER_PREPARER = 'a_modeliser_preparer',
  A_GRAVER = 'a_graver',
  A_PRENDRE_EN_PHOTO = 'a_prendre_en_photo',
  A_LIVRER = 'a_livrer',
  A_METTRE_EN_LIGNE = 'a_mettre_en_ligne',
  A_FACTURER = 'a_facturer',
}

export interface Client {
  id_client: string;
  nom?: string;
  prénom?: string;
  mail: string;
  téléphone: string;
  adresse?: string;
  tva?: string;
}

export interface Commande {
  id_commande: string;
  date_commande: string;
  deadline?: string;
  produit?: string;
  description?: string;
  fichiers_joints?: string;
  statut_commande: StatutCommande;
  client: Client;
}
