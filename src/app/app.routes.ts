import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { EditorasComponent } from './pages/editoras/editoras.component';
import { PersonagensComponent } from './pages/personagens/personagens.component';
import { EquipesComponent } from './pages/equipes/equipes.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'editoras', component: EditorasComponent },
  { path: 'personagens', component: PersonagensComponent },
  { path: 'equipes', component: EquipesComponent },
  { path: 'hqs', component: HomeComponent }, // Temporário
  { path: '**', redirectTo: '/login' } // ← Esta deve ser a ÚLTIMA rota
];