import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-button-logout',
  standalone: true,
  imports: [],
  templateUrl: './button-logout.component.html',
  styleUrl: './button-logout.component.scss'
})
export class ButtonLogoutComponent {
  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout().subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Déconnexion réussie',
        detail: 'Vous avez bien été déconnecté',
        life: 5000
      });
    });
    this.router.navigate(['/']);
  }
}