import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm !: FormGroup;
  loggedIn: boolean = false;
  isPasswordVisible: boolean = false;

  constructor(private fb: FormBuilder,
    private authService : AuthService,
    private router: Router) { }

  ngOnInit(): void {
   this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = this.fb.group({
      userName: [null, Validators.required],
      password: [null, Validators.required] 
    });
  }

  onLogin(){
    const loginFormValue = this.loginForm.value;
    this.loggedIn = this.authService.login(loginFormValue.userName,loginFormValue.password);
    if(this.loggedIn){
      this.router.navigate(['home']);
    }
  
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  togglePasswordVisibility(passwordInput: HTMLInputElement) {
    this.isPasswordVisible = !this.isPasswordVisible;
    passwordInput.type = this.isPasswordVisible ? 'text' : 'password';
}



}
