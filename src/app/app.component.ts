import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'BillingWeb';


  constructor(private authService: AuthService,
    private router: Router) {}

  isLoggedIn(): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    const isLoginPage = this.router.url.includes('/login');
    return isLoggedIn && !isLoginPage;
  }

}
