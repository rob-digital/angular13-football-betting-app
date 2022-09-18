import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginViewModel } from '../classes/login-view-model';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginViewModel: LoginViewModel = new LoginViewModel()
  loginError: string = ""
  isDarkEnable = false;

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {}

  onLoginClick(event: any)
  {
    this.loginService.Login(this.loginViewModel).subscribe(
      (response) => {
        this.router.navigateByUrl('/bet')
      },
      (error) => {
        console.log("Login Error: ", error);
        this.loginError = "Invalid Username or Password"

      }
    )
  }
}
