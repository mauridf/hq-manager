import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = 'HQManager';
  private router = inject(Router);
  private authService = inject(AuthService);

  shouldShowLayout(): boolean {
    const currentRoute = this.router.url;
    const isAuthPage = currentRoute === '/login' || currentRoute === '/register';
    const isAuthenticated = this.authService.isLoggedIn();
    
    // Mostrar layout apenas se estiver autenticado e não for página de auth
    return isAuthenticated && !isAuthPage;
  }
}