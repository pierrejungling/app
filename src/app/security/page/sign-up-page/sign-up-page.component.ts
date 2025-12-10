import { Component, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FloatingLabelInputComponent, HeaderComponent } from '@shared';
import { SignUpForm } from '../../data/form';
import { handleFormError, getFormValidationErrors, FormError } from '@shared';
import { AppRoutes } from '@shared';

// Validateur personnalisé pour vérifier que les mots de passe correspondent
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  
  if (!password || !confirmPassword) {
    return null;
  }
  
  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-sign-up-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FloatingLabelInputComponent, TranslateModule, HeaderComponent],
  templateUrl: './sign-up-page.component.html',
  styleUrl: './sign-up-page.component.scss'
})
export class SignUpPageComponent {
  title: string = 'Créer un compte';
  subTitle: string = 'Rejoignez-nous et commencez votre aventure';
  successMessage: string = '';
  errors: WritableSignal<FormError[]> = signal([]);
  formGroup!: FormGroup<SignUpForm>;

  constructor(private router: Router) {
    this.initFormGroup();
    handleFormError(this.formGroup, this.errors);
  }

  get(key: string): FormControl<any> {
    return this.formGroup.get(key) as FormControl<any>;
  }

  private initFormGroup(): void {
    this.formGroup = new FormGroup<SignUpForm>(<SignUpForm>{
      username: new FormControl<string>('', [
        Validators.required, 
        Validators.minLength(3), 
        Validators.maxLength(20)
      ]),
      email: new FormControl<string>('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      confirmPassword: new FormControl<string>('', [
        Validators.required
      ])
    }, { validators: passwordMatchValidator });

    this.formGroup.valueChanges.subscribe(() => 
      console.log('signUpFormGroupValue', this.formGroup.value)
    );
  }

  signUp(): void {
    if (this.formGroup.valid) {
      const formValue = this.formGroup.value;
      
      // Encoder les identifiants (username et password en base64)
      const encodedUsername = btoa(formValue.username || '');
      const encodedPassword = btoa(formValue.password || '');
      
      // Stocker les identifiants encodés dans le localStorage
      // En production, cela devrait être envoyé au backend
      const userData = {
        username: encodedUsername,
        password: encodedPassword,
        email: formValue.email,
        originalUsername: formValue.username // Pour affichage uniquement
      };
      
      localStorage.setItem('userCredentials', JSON.stringify(userData));
      
      this.successMessage = 'Inscription réussie ! Redirection vers la page de connexion...';
      
      // Rediriger vers la page de connexion après 2 secondes
      setTimeout(() => {
        this.router.navigate([AppRoutes.SIGN_IN]);
      }, 2000);
    } else {
      this.formGroup.markAllAsTouched();
      this.errors.set(getFormValidationErrors(this.formGroup));
    }
  }

  goToSignIn(): void {
    this.router.navigate([AppRoutes.SIGN_IN]);
  }
}
