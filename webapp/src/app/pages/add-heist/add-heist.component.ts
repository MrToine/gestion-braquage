import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { NumberFormatPipe } from '../../pipes/mil-format.pipe';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-add-heist',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FloatLabelModule,
    CommonModule,
    FormsModule,
    InputTextModule,
    MessagesModule,
    NumberFormatPipe
  ],
  templateUrl: './add-heist.component.html',
  styleUrl: './add-heist.component.scss'
})
export class AddHeistComponent implements OnInit {
  formGroup!: FormGroup;

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
      name: ['', [Validators.required]],
      cost: ['', [Validators.required, Validators.min(1)]],
      rewardMoney: ['', [Validators.required, Validators.min(1)]],
    });
  }

  addHeist() {
    if (this.formGroup.valid) {
      let heist = this.formGroup.value;
      try {
        this.api.createHeist(heist).subscribe(() => {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Ajout réussi', 
            detail: `Le braquage ${heist.name} a bien été ajouté. Le coût est de ${heist.cost}$ et la récompense est de ${heist.rewardMoney}$.`,
            life: 5000,
          })
        });
      } catch (error) {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erreur', 
          detail: 'Une erreur est survenue lors de l\'ajout du braquage : ' + error,
          life: 5000,
        });
      }
    }
    this.formGroup.reset();
  }
}
