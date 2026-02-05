import { Component, inject, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AppRoutes, AppNode, ThemeService } from '@shared';
import { TokenService } from '@api';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  logoLoaded = false;
  logoError = false;
  private readonly tokenService: TokenService = inject(TokenService);
  private readonly themeService: ThemeService = inject(ThemeService);
  
  // Signal pour le thème actuel
  isDarkMode = computed(() => this.themeService.isDarkMode());
  
  // Liste des fichiers logo possibles à essayer (ordre de priorité)
  private readonly possibleLogosLight = [
    // Logo principal spécifié par l'utilisateur (mode clair)
    'assets/images/Logo/La Gravisterie_N.svg',
    // Fallback vers autres formats
    'assets/images/Logo/La Gravisterie avec noir txt_N.svg',
    'assets/images/Logo/La Gravisterie carré_N.svg',
    'assets/images/Logo/logo_carre.png'
  ];

  private readonly possibleLogosDark = [
    // Logo blanc pour mode nuit
    'assets/images/Logo/La Gravisterie Blanc.svg',
    // Fallback vers autres formats blancs
    'assets/images/Logo/La Gravisterie blanc sans fond copie.svg',
    'assets/images/Logo/La Gravisterie blanc carré.svg',
    'assets/images/Logo/La Gravisterie avec txt blanc sans fond copie.svg'
  ];

  // Signal pour le logo de fallback (en cas d'erreur)
  private fallbackLogoPath = signal<string>('');

  // Computed signal pour le logo selon le thème
  logoPath = computed(() => {
    // Si un fallback a été défini, l'utiliser
    const fallback = this.fallbackLogoPath();
    if (fallback) {
      return fallback;
    }
    
    // Sinon, utiliser le logo selon le thème
    const isDark = this.themeService.isDarkMode();
    const possibleLogos = isDark ? this.possibleLogosDark : this.possibleLogosLight;
    return possibleLogos[0];
  });
  
  // Signal computed pour l'authentification (réactif)
  isAuthenticated = computed(() => {
    const token = this.tokenService.token();
    return !token.isEmpty && token.token.trim().length > 0;
  });

  // Signal pour suivre la route actuelle
  currentRoute = signal<string>('');
  showBackButton = computed(() => {
    if (!this.isAuthenticated()) return false;
    const route = this.currentRoute();
    // Afficher le bouton retour si on n'est pas sur la page d'accueil du dashboard
    return route !== `/${AppNode.AUTHENTICATED}` && route !== `/${AppNode.AUTHENTICATED}/`;
  });
  
  constructor(private router: Router) {
    // Écouter les changements de route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute.set(event.url);
      });
    
    // Initialiser avec la route actuelle
    this.currentRoute.set(this.router.url);

    // Réinitialiser le fallback quand le thème change
    effect(() => {
      this.themeService.theme(); // S'abonner aux changements de thème
      this.fallbackLogoPath.set(''); // Réinitialiser le fallback
      this.logoLoaded = false; // Forcer le rechargement du logo
    });
  }
  
  logout(): void {
    // Nettoyer le token via le TokenService
    this.tokenService.setToken({ token: '', refreshToken: '', isEmpty: true });
    localStorage.removeItem('currentUser');
    
    // Rediriger vers la page de connexion
    this.router.navigate([AppRoutes.SIGN_IN]);
  }

  goToSettings(): void {
    this.router.navigate(['/dashboard/settings']);
  }

  goBack(): void {
    // Utiliser l'historique du navigateur pour revenir à la page précédente
    window.history.back();
  }

  goToDashboard(): void {
    this.router.navigate([AppRoutes.AUTHENTICATED]);
  }
  
  private encodeLogoPath(path: string): string {
    // Encoder les espaces et caractères spéciaux dans l'URL
    return path.split('/').map(part => encodeURIComponent(part)).join('/');
  }
  
  onLogoLoad(): void {
    this.logoLoaded = true;
    this.logoError = false;
    // Réinitialiser le fallback quand le logo charge avec succès
    this.fallbackLogoPath.set('');
    console.log('Logo chargé avec succès:', this.logoPath());
  }
  
  onLogoError(): void {
    const isDark = this.themeService.isDarkMode();
    const possibleLogos = isDark ? this.possibleLogosDark : this.possibleLogosLight;
    const currentPath = this.logoPath();
    
    // Trouver l'index du logo actuel dans la liste appropriée
    const currentIndex = possibleLogos.indexOf(currentPath);
    
    console.error('Erreur de chargement du logo:', currentPath, 'Index:', currentIndex);
    
    // Essayer le logo suivant
    if (currentIndex < possibleLogos.length - 1 && currentIndex >= 0) {
      // Essayer sans encodage d'abord
      const nextLogo = possibleLogos[currentIndex + 1];
      this.fallbackLogoPath.set(nextLogo);
      this.logoLoaded = false;
      console.log('Essai du logo suivant (sans encodage):', nextLogo);
    } else if (currentIndex === -1 && !currentPath.includes('%20')) {
      // Le logo actuel n'est pas dans la liste, essayer avec encodage
      console.log('Tentative avec encodage des espaces...');
      const encodedLogo = this.encodeLogoPath(possibleLogos[0]);
      this.fallbackLogoPath.set(encodedLogo);
      this.logoLoaded = false;
    } else {
      // Tous les logos ont échoué
      this.logoError = true;
      this.logoLoaded = false;
      console.error('Tous les logos ont échoué à charger');
    }
  }
  
  showTextFallback(): boolean {
    return !this.logoLoaded && this.logoError;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
