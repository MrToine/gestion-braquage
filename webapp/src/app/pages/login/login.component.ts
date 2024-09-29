import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  returnUrl: string = '/';
  
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
    });

    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // Check if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const login = this.loginForm.value;
      this.authService.login(login).subscribe({
        next: (response: any) => {
          if (response && response.user) {
            this.messageService.add({
              severity: 'success',
              summary: 'Connexion réussie',
              detail: `Bienvenue ${response.user.firstname} ${response.user.lastname}`,
              life: 5000
            });
            // Navigate to the return URL
            this.router.navigate([this.returnUrl]);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Connexion échouée',
              detail: 'Réponse du serveur invalide',
              life: 5000
            });
          }
        },
        error: (error) => {
          console.error('Login failed', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Connexion échouée',
            detail: 'Pseudo ou mot de passe incorrect',
            life: 5000
          });
        }
      });
    }
  }
}