import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '@shared';
import { ApiService } from '@api';
import { ApiURI } from '@api';
import { ApiResponse } from '@api';
import { Commande, StatutCommande } from '../../../feature/commande/model/commande.interface';

export interface DashboardCard {
  title: string;
  description: string;
  route: string;
  icon: string;
  count?: number;
  countTerminees?: number;
  countAnnulees?: number;
}

@Component({
  selector: 'app-dashboard-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './dashboard-home-page.component.html',
  styleUrl: './dashboard-home-page.component.scss'
})
export class DashboardHomePageComponent implements OnInit {
  logoPath = '';
  logoError = false;
  currentUser: string = 'Utilisateur';
  private readonly apiService: ApiService = inject(ApiService);
  
  dashboardCards: DashboardCard[] = [
    {
      title: 'Nouvelle commande',
      description: 'Créer une nouvelle commande',
      route: '/dashboard/commandes/nouvelle',
      icon: '➕',
    },
    {
      title: 'Commandes en cours',
      description: 'Suivez l\'état de vos commandes en cours de traitement',
      route: '/dashboard/commandes/en-cours',
      icon: '📋',
      count: 0
    },
    {
      title: 'Commandes terminées ou annulées',
      description: 'Consultez vos commandes finalisées',
      route: '/dashboard/commandes/terminees',
      icon: '✅',
      countTerminees: 0,
      countAnnulees: 0
    },
  ];

  ngOnInit(): void {
    // Définir le chemin du logo
    this.logoPath = this.getLogoPath();
    
    // Récupérer le nom d'utilisateur depuis localStorage (fallback)
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = storedUser;
    }
    
    // Récupérer les informations de l'utilisateur depuis l'API
    this.apiService.get(ApiURI.ME).subscribe({
      next: (response: ApiResponse) => {
        if (response.result && response.data && response.data.username) {
          this.currentUser = response.data.username;
          // Mettre à jour localStorage avec le username de l'API
          localStorage.setItem('currentUser', response.data.username);
        }
      },
      error: (error: any) => {
        console.error('Erreur lors de la récupération des informations utilisateur:', error);
        // En cas d'erreur, utiliser le nom stocké dans localStorage ou "Utilisateur"
        this.currentUser = storedUser || 'Utilisateur';
      }
    });

    // Charger les commandes pour mettre à jour les compteurs
    this.loadCommandesCount();
  }

  loadCommandesCount(): void {
    this.apiService.get(ApiURI.LISTE_COMMANDES).subscribe({
      next: (response: ApiResponse) => {
        if (response.result && response.data) {
          const commandes = response.data as Commande[];
          
          // Compter les commandes non terminées (excluant aussi les annulées)
          const commandesEnCours = commandes.filter(cmd => 
            cmd.statut_commande !== StatutCommande.TERMINE && cmd.statut_commande !== StatutCommande.ANNULEE
          ).length;

          // Compter séparément les commandes terminées et annulées
          const commandesTerminees = commandes.filter(cmd => 
            cmd.statut_commande === StatutCommande.TERMINE
          ).length;

          const commandesAnnulees = commandes.filter(cmd => 
            cmd.statut_commande === StatutCommande.ANNULEE
          ).length;

          // Mettre à jour le compteur de la carte "Commandes en cours"
          const commandesEnCoursCard = this.dashboardCards.find(card => card.title === 'Commandes en cours');
          if (commandesEnCoursCard) {
            commandesEnCoursCard.count = commandesEnCours;
          }

          // Mettre à jour les compteurs de la carte "Commandes terminées ou annulées"
          const commandesTermineesCard = this.dashboardCards.find(card => card.title === 'Commandes terminées ou annulées');
          if (commandesTermineesCard) {
            commandesTermineesCard.countTerminees = commandesTerminees;
            commandesTermineesCard.countAnnulees = commandesAnnulees;
          }
        }
      },
      error: (error: any) => {
        console.error('Erreur lors de la récupération des commandes:', error);
      }
    });
  }

  getLogoPath(): string {
    // Utiliser le logo spécifié par l'utilisateur
    return 'assets/images/Logo/La Gravisterie_N.svg';
  }

  onLogoLoad(): void {
    this.logoError = false;
    console.log('Logo chargé avec succès:', this.logoPath);
  }

  onLogoError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      console.error('Erreur de chargement du logo:', img.src);
      img.style.display = 'none';
    }
    
    // Essayer le logo suivant
    this.tryNextLogo();
  }

  /** Indique que l’on arrive sur « Commandes en cours » depuis cette page (sections fermées au chargement). */
  setEntryFromForCommandesEnCours(value: string): void {
    try {
      sessionStorage.setItem('commandes-en-cours-entry-from', value);
    } catch {}
  }

  /** Indique que l’on arrive sur « Nouvelle commande » depuis le dashboard (pas de restauration de scroll). */
  clearScrollForNouvelleCommande(): void {
    try {
      sessionStorage.setItem('nouvelle-commande-clear-scroll', '1');
    } catch {}
  }

  tryNextLogo(): void {
    const possibleLogos = [
      'assets/images/Logo/La Gravisterie avec noir txt_N.svg',
      'assets/images/Logo/La Gravisterie_N.svg',
      'assets/images/Logo/La Gravisterie carré_N.svg',
      'assets/images/Logo/logo_carre.png',
      'assets/images/Logo/La Gravisterie blanc carré.svg'
    ];
    
    // Trouver l'index du logo actuel
    const currentIndex = possibleLogos.indexOf(this.logoPath);
    
    if (currentIndex < possibleLogos.length - 1) {
      // Essayer le logo suivant sans encoder d'abord
      this.logoPath = possibleLogos[currentIndex + 1];
      this.logoError = false;
      console.log('Essai du logo suivant (sans encodage):', this.logoPath);
    } else {
      // Si tous les logos sans encodage ont échoué, essayer avec encodage
      if (!this.logoPath.includes('%20')) {
        console.log('Tentative avec encodage des espaces...');
        this.logoPath = possibleLogos[0].split('/').map(part => encodeURIComponent(part)).join('/');
        this.logoError = false;
      } else {
        // Tous les logos ont échoué
        this.logoError = true;
        console.error('Tous les logos ont échoué à charger');
      }
    }
  }
}
