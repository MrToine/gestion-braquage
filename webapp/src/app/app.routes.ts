import { Routes } from '@angular/router';
import { UsersComponent } from './pages/users/users.component';
import { HeistsComponent } from './pages/heists/heists.component';
import { AddHeistComponent } from './pages/add-heist/add-heist.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guard/auth.guard';
import { adminGuard } from './guard/admin.guard';
import { AddPostComponent } from './pages/add-post/add-post.component';
import { AddUserComponent } from './pages/add-user/add-user.component';

export const routes: Routes = [
    {path: '', component: HomeComponent, canActivate: [authGuard]},

    {path: 'login', component: LoginComponent},

    {path: 'posts/add', component: AddPostComponent, canActivate: [authGuard, adminGuard]},

    {path: 'users/add', component: AddUserComponent, canActivate: [authGuard, adminGuard]},
    {path: 'users/:id/heists', component: UsersComponent, canActivate: [authGuard]},
    {path: 'users/:id', component: UsersComponent, canActivate: [authGuard]},
    {path: 'users', component: UsersComponent, canActivate: [authGuard]},

    {path: 'heists/add', component: AddHeistComponent, canActivate: [authGuard, adminGuard]},
    {path: 'heists/:id', component: HeistsComponent, canActivate: [authGuard]},
    {path: 'heists', component: HeistsComponent, canActivate: [authGuard]},
];
