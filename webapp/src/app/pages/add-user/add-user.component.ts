import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../services/api.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FloatLabelModule,
    CommonModule,
    FormsModule,
    InputTextModule,
    MessagesModule
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {
  formGroup!: FormGroup;
  userLogin: string = '';
  userPassword: string = '';

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.formGroup = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required, Validators.min(1)]],
    });
  }

  addUser() {
    if (this.formGroup.valid) {
      let user = this.formGroup.value;
      // On génère un mot de passe aléatoire
      user.password = Math.random().toString(36).slice(-8);
      this.userPassword = user.password;
      this.userLogin = user.firstname.charAt(0).toLowerCase() + user.lastname.toLowerCase();
      try {
        this.api.createUser(user).subscribe(() => {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Ajout réussi', 
            detail: `L'utilisateur ${user.firstname} ${user.lastname} a bien été ajouté.`,
            life: 5000,
          })
        });
      } catch (error) {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erreur', 
          detail: `Une erreur est survenue lors de l'ajout de l'utilisateur.`,
          life: 5000,
        });
      }
    }
    this.formGroup.reset();
  }
}
