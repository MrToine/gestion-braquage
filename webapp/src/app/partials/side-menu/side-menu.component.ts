import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonLogoutComponent } from '../../components/button-logout/button-logout.component';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [
    RouterModule,
    ButtonLogoutComponent,
    CommonModule
  ],
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {
  username: string = 'Invité';
  isLogged: boolean = false;
  userRole: string = '';

  constructor(
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.currentUser.subscribe(user => {
      if (user) {
        this.isLogged = true;
        this.username = `${user.firstname} ${user.lastname}`;
        this.userRole = user.role;
      } else {
        this.isLogged = false;
        this.username = 'Invité';
        this.userRole = '';
      }
    });
  }
}