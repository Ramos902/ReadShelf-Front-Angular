import { CommonModule } from '@angular/common'; 
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Variável para guardar mensagens de erro da API
  public apiError: string | null = null;

  // Definição do nosso formulário
  public loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  // Método chamado quando o formulário é enviado
  onSubmit(): void {
    // Limpa erros antigos
    this.apiError = null;

    // Se o formulário estiver inválido, não faz nada
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // Mostra erros em todos os campos
      return;
    }

    // Chama o serviço de autenticação
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        // Sucesso!
        console.log('Login bem-sucedido!', response);
        // Redireciona para o "dashboard" (que criaremos em breve)
        this.router.navigate(['/shelf']);
      },
      error: (err) => {
        // Erro!
        console.error('Erro no login:', err);
        
        if (err.status === 400 || err.status === 401) {
          this.apiError = typeof err.error === 'string' ? err.error : "E-mail ou senha inválidos.";
        } else {
          this.apiError = "Ocorreu um erro. Tente novamente mais tarde.";
        }
      }
    });
  }

  // --- Funções de Ajuda para o Template ---
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);

    if (field?.hasError('required')) {
      return 'Campo obrigatório';
    }
    if (field?.hasError('email')) {
      return 'E-mail inválido';
    }
    if (field?.hasError('minlength')) {
      return `Deve ter no mínimo ${field.errors?.['minlength'].requiredLength} caracteres`;
    }
    return '';
  }
}