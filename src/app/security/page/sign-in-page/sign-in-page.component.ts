import { Component, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FloatingLabelInputComponent, HeaderComponent } from '@shared';
import { SignInForm } from '../../data/form';
import { handleFormError, getFormValidationErrors, FormError } from '@shared';
import { AppRoutes } from '@shared';

@Component({
  selector: 'app-sign-in-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FloatingLabelInputComponent, TranslateModule, HeaderComponent],
  templateUrl: './sign-in-page.component.html',
  styleUrl: './sign-in-page.component.scss'
})
export class SignInPageComponent {
  title: string = 'Welcome back !';
  subTitle: string = 'Identifiez-vous pour accéder à l\'administration de La Gravisterie';
  successMessage: string = '';
  logoPath: string = 'assets/images/Logo/La Gravisterie_N.svg';
  logoError: boolean = false;

  formGroup!: FormGroup<SignInForm>;
  errors: WritableSignal<FormError[]> = signal([]);

  constructor(private router: Router) {
    this.initFormGroup();
    // !!!!!! YOU NEED TO CALL THIS IN CONSTRUCTOR COMPONENT !!!!!!!!! BECAUSE OF TAKEUNTILDESTROYED
    handleFormError(this.formGroup, this.errors);
  }

  get(key: string): FormControl<any> {
    return this.formGroup.get(key) as FormControl<any>;
  }

  private initFormGroup(): void {
    this.formGroup = new FormGroup<SignInForm>(<SignInForm>{
      username: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      password: new FormControl<string>('', [Validators.required])
    });
    // Subscribe to valueChanges to log form values (for testing)
    this.formGroup.valueChanges.subscribe(() => 
      console.log('formGroupValue', this.formGroup.value)
    );
  }

  signIn(): void {
    if (this.formGroup.valid) {
      const formValue = this.formGroup.value;
      const username = formValue.username || '';
      const password = formValue.password || '';
      
      // Récupérer les identifiants encodés depuis localStorage
      const storedData = localStorage.getItem('userCredentials');
      
      if (storedData) {
        try {
          const userData = JSON.parse(storedData);
          
          // Décoder les identifiants stockés
          const decodedUsername = atob(userData.username);
          const decodedPassword = atob(userData.password);
          
          // Vérifier si les identifiants correspondent
          if (username === decodedUsername && password === decodedPassword) {
            this.successMessage = 'Connexion réussie ! Redirection...';
            console.log('Connexion réussie pour:', decodedUsername);
            
            // Stocker l'état de connexion
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('currentUser', decodedUsername);
            
            // Rediriger vers le dashboard après un court délai
            setTimeout(() => {
              this.router.navigate([AppRoutes.AUTHENTICATED]);
            }, 1000);
          } else {
            this.errors.set([{
              control: 'credentials',
              value: '',
              error: 'Nom d\'utilisateur ou mot de passe incorrect'
            }]);
          }
        } catch (error) {
          console.error('Erreur lors du décodage des identifiants:', error);
          this.errors.set([{
            control: 'credentials',
            value: '',
            error: 'Erreur lors de la vérification des identifiants. Les données peuvent être corrompues.'
          }]);
        }
      } else {
        this.errors.set([{
          control: 'credentials',
          value: '',
          error: 'Aucun compte trouvé. Veuillez vous inscrire d\'abord.'
        }]);
      }
    } else {
      // Trigger validation errors display
      this.formGroup.markAllAsTouched();
      this.errors.set(getFormValidationErrors(this.formGroup));
    }
  }

  goToSignUp(): void {
    this.router.navigate([AppRoutes.SIGN_UP]);
  }

  onLogoLoad(): void {
    this.logoError = false;
  }

  onLogoError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.style.display = 'none';
    }
    this.logoError = true;
  }
}
