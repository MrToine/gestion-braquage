import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../services/api.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FloatLabelModule,
    CommonModule,
    FormsModule,
    InputTextModule,
    MessagesModule
  ],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.scss'
})
export class AddPostComponent {
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
      title: ['', [Validators.required]],
      content: ['', [Validators.required, Validators.min(1)]],
    });
  }

  addPost() {
    if (this.formGroup.valid) {
      this.api.createPost(this.formGroup.value).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Post added successfully' });
          this.formGroup.reset();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Post not added' });
        }
      });
    }
  }
}
