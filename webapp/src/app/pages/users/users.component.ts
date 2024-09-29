import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { NumberFormatPipe } from '../../pipes/mil-format.pipe';
import { DropdownModule } from 'primeng/dropdown';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    HttpClientModule,
    TableModule,
    CommonModule,
    NumberFormatPipe,
    DropdownModule,
    ReactiveFormsModule,
    ConfirmPopupModule,
    ButtonModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  users = <any>[];

  userDetail: any = null;
  selectedUser: any = null;
  heists = <any>[];
  openFormHesists = false;
  openFormUser = false;
  selectedUserHeist: any = null;
  formGroup!: FormGroup;
  userFormGroup!: FormGroup;
  userRoleFormGroup!: FormGroup;
  currentUserId: any;
  currentUserRole: any;

  login: any;
  phoneNumber: any;
  biography: any;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public auth: AuthService
  ) {
    this.currentUserId = this.auth.currentUserValue?.id;
    this.currentUserRole = this.auth.currentUserValue?.role;
    this.login = this.auth.currentUserValue?.login;
    this.phoneNumber = this.auth.currentUserValue?.phoneNumber;
    this.biography = this.auth.currentUserValue?.biography;
  }

  ngOnInit() {
    this.initForm();
    this.loadData();
  }

  initForm() {
    this.formGroup = this.fb.group({
      heists: [''],
    });
    this.userFormGroup = this.fb.group({
      phoneNumber: [`${this.phoneNumber}`, [Validators.required]],
      biography: [`${this.biography}`, [Validators.required]],
    });
    this.userRoleFormGroup = this.fb.group({
      role: ['', [Validators.required]],
    });
  }

  loadData() {
    this.api.getAllUsers().subscribe((users: any) => {
      this.users = users;
    });
  }

  userDetails(id: string) {
    if (this.selectedUser === id) {
      this.selectedUser = null;
      this.userDetail = null;
    } else {
      this.selectedUser = id;
      this.api.getUser(id).subscribe((user: any) => {
        this.userDetail = user;
      });
    }
  }

  userAddHeist(userId: string) {
    if (this.selectedUserHeist != userId) {
      this.openFormHesists = false;
      this.selectedUserHeist = null;
    }
    this.openFormHesists = !this.openFormHesists;
    this.api.getAllHeists().subscribe((heists: any) => {
      this.heists = heists
      this.selectedUserHeist = userId;
    });
  }

  addHeistToUser() {
    const heist = this.formGroup.get('heists')?.value;
    if (heist.id && this.selectedUserHeist) {
      console.log("On ajoute le heist à l'utilisateur", this.selectedUserHeist);
      this.api.postUserHeist(this.selectedUserHeist, heist.id).subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: 'Confirmation', detail: 'Braquage ajouté', life: 5000 });
          this.openFormHesists = false;
          this.loadData();
        },
        (error) => {
          console.error('Erreur lors de l\'ajout du braquage', error);
        }
      );
    }
  }

  confirmDeactivateUser(event: Event, id: string) {
    try {
      this.api.desactivateUser(id).subscribe({ next: () => {
        this.confirmationService.confirm({
          target: event.target as EventTarget,
          message: 'Es-tu sûr de vouloir désactiver cet utilisateur ?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
              this.messageService.add({ severity: 'success', summary: 'Confirmation', detail: 'Utilisateur désactivé', life: 5000 });
              this.loadData();
          },
          reject: () => {
              this.messageService.add({ severity: 'error', summary: 'Annulation', detail: 'Opération annulée', life: 5000 });
          }
        });
    }});
    } catch (error) {
      console.error('Erreur lors de la désactivation de l\'utilisateur', error);
    }
  }

  confirmActivateUser(event: Event, id: string) {
    try {
      this.api.activateUser(id).subscribe({ next: () => {
        this.confirmationService.confirm({
          target: event.target as EventTarget,
          message: 'Es-tu sûr de vouloir activer cet utilisateur ?',
          icon: 'pi pi-check-circle',
          accept: () => {
              this.messageService.add({ severity: 'success', summary: 'Confirmation', detail: 'Utilisateur désactivé', life: 5000 });
              this.loadData();
          },
          reject: () => {
              this.messageService.add({ severity: 'error', summary: 'Annulation', detail: 'Opération annulée', life: 5000 });
          }
        });
      }});
    } catch (error) {
      console.error('Erreur lors de la désactivation de l\'utilisateur', error);
    }
  }

  userEdit(event: Event, id: string) {
    this.openFormUser = !this.openFormUser;
    this.selectedUser = id;
  }

  patchUser(): void {
    console.log('Patch user', this.userFormGroup.value);
    if (this.selectedUser) {
      const user = this.userRoleFormGroup.value;
      console.log('Patch user', this.selectedUser, user.role);
      // Si l'utilisateur connecté est un admin et qu'il édite un autre utilisateur, ne mettre à jour que le rôle
      if (this.currentUserRole === 'admin' && this.selectedUser !== this.currentUserId) {
        this.api.updateRoleUser(this.selectedUser, user.role).subscribe({
          next: (response) => {
            this.messageService.add({ severity: 'success', summary: 'Confirmation', detail: 'Rôle de l\'utilisateur modifié', life: 5000 });
            this.openFormUser = false;
            this.loadData();
          },
          error: (error) => {
            console.error('Erreur lors de la modification du rôle de l\'utilisateur', error);
          }
        });
      } else {
        const user = this.userFormGroup.value; 
        // Sinon, mettre à jour toutes les informations de l'utilisateur
        this.api.updateUser(this.selectedUser, user).subscribe({
          next: (response) => {
            this.messageService.add({ severity: 'success', summary: 'Confirmation', detail: 'Utilisateur modifié', life: 5000 });
            this.openFormUser = false;
            this.loadData();
          },
          error: (error) => {
            console.error('Erreur lors de la modification de l\'utilisateur', error);
          }
        });
      }
    }
  }
}
