import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: '/login' },
  { path: 'editoras', component: HomeComponent }, // Temporário
  { path: 'personagens', component: HomeComponent }, // Temporário
  { path: 'equipes', component: HomeComponent }, // Temporário
  { path: 'hqs', component: HomeComponent }, // Temporário
  { path: '**', redirectTo: '/home' }
];