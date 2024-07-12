import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {

  }

  login(username: string, password: string): boolean {
     const loggedIn = false;
    if (!username || !password) {
      return false;
    }

    if (username === 'admin' && password === 'admin') {
        localStorage.setItem('isLoggedIn', 'true');
      return true; 
    } else {
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }



}
