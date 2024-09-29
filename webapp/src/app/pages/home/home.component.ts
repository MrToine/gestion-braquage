import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  posts: any = [];
  editPostFormGroup!: FormGroup;
  userRole: string = '';
  formEditPost: boolean = false;
  selectedPost: any = {};

  constructor(
    private api: ApiService,
    public auth: AuthService,
    private fb: FormBuilder,
  ) {
    this.userRole = this.auth.getUserRole() ?? '';
  }

  ngOnInit() {
    this.editPostFormGroup = this.fb.group({
      content: [`${this.selectedPost.content}`],
    });
    this.loadData();
  }

  loadData() {
    this.api.getAllPosts().subscribe((data) => {
      this.posts = data;
    });
  }

  editPostForm(event: Event, post: any) {
    console.log('editPostForm', post);
    this.formEditPost = !this.formEditPost;
    this.selectedPost = post;
    this.editPostFormGroup.patchValue({
      content: post.content
    });
  }

  editPost(event: Event, post: string) {
    console.log('editPost', post);
    this.api.updatePost(this.selectedPost.id, this.editPostFormGroup.value).subscribe({
      next: () => {
        this.api.getAllPosts().subscribe((data) => {
          this.posts = data;
        });
      }
    });
    this.formEditPost = false;
    this.loadData();
  }
}