import { Component, OnInit, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '@shared';
import { ApiService } from '@api';
import { ApiURI } from '@api';
import { Commande, StatutCommande } from '../../model/commande.interface';

@Component({
  selector: 'app-commandes-en-cours-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './commandes-en-cours-page.component.html',
  styleUrl: './commandes-en-cours-page.component.scss'
})
export class CommandesEnCoursPageComponent implements OnInit {
  commandes: WritableSignal<Commande[]> = signal([]);
  isLoading: WritableSignal<boolean> = signal(false);
  
  private readonly apiService: ApiService = inject(ApiService);

  // Ordre des colonnes de statut
  readonly statuts: StatutCommande[] = [
    StatutCommande.EN_ATTENTE_INFORMATION,
    StatutCommande.A_MODELLISER_PREPARER,
    StatutCommande.A_GRAVER,
    StatutCommande.A_PRENDRE_EN_PHOTO,
    StatutCommande.A_LIVRER,
    StatutCommande.A_METTRE_EN_LIGNE,
    StatutCommande.A_FACTURER,
  ];

  // Labels pour chaque statut
  readonly statutLabels: Record<StatutCommande, string> = {
    [StatutCommande.EN_ATTENTE_INFORMATION]: 'En Attente de + d\'infos',
    [StatutCommande.A_MODELLISER_PREPARER]: 'À Modéliser / Préparer',
    [StatutCommande.A_GRAVER]: 'À Graver',
    [StatutCommande.A_PRENDRE_EN_PHOTO]: 'À Prendre en photo',
    [StatutCommande.A_LIVRER]: 'À Livrer',
    [StatutCommande.A_METTRE_EN_LIGNE]: 'À Mettre en ligne',
    [StatutCommande.A_FACTURER]: 'À Facturer',
  };

  ngOnInit(): void {
    this.loadCommandes();
  }

  loadCommandes(): void {
    this.isLoading.set(true);
    this.apiService.get(ApiURI.LISTE_COMMANDES).subscribe({
      next: (response) => {
        if (response.result && response.data) {
          this.commandes.set(response.data);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des commandes:', error);
        this.isLoading.set(false);
      }
    });
  }

  getCommandesByStatut(statut: StatutCommande): Commande[] {
    return this.commandes().filter(c => c.statut_commande === statut);
  }

  getStatutLabel(statut: StatutCommande): string {
    return this.statutLabels[statut];
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  }

  getClientName(client: Commande['client']): string {
    const nom = client.nom || '';
    const prenom = client.prénom || '';
    return `${nom} ${prenom}`.trim() || 'Non renseigné';
  }
}
