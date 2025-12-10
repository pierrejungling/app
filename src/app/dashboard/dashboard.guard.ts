import { inject } from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';

export function DashboardGuard(redirectRoute: string = '/account/signin'): CanActivateFn {
    return () => {
        // Vérifier l'authentification depuis localStorage
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        const router: Router = inject(Router);
        
        if (isAuthenticated) {
            return true;
        } else {
            // Rediriger vers la page de connexion si non authentifié
            return router.createUrlTree([redirectRoute]);
        }
    };
}