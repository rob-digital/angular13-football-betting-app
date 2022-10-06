import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { User } from '../classes/user-model';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isDarkEnable = false;
  user: User = new User();
  loginError: string = ""
  inTransit: boolean = false



  constructor(public authenticationService: AuthenticationService, public router: Router) { }

  ngOnInit(): void {

  //   if (this.authenticationService.currentUser == null || this.authenticationService.currentUsername == null)
  //  {
  //   console.log('this.authenticationService.currentUser:', this.authenticationService.currentUser)
  //   console.log('this.authenticationService.currentUsername:', this.authenticationService.currentUsername)
  //  history.pushState(null, '', location.href);
  //     window.onpopstate = function () {
  //       history.go(1);
  //     };
  // }
}

  onLoginClick(event: any)
  {
    // this.loginService.Login(this.loginViewModel).subscribe(
    //   (response) => {
    //     this.router.navigateByUrl('/predict')
    //   },
    //   (error) => {
    //     console.log("Login Error: ", error);
    //     this.loginError = "Invalid Username or Password"

    //   }
    // )
  }

  login(event: any) {
    this.authenticationService.login(this.user).subscribe(data => {

      data == null ? this.inTransit = true : this.inTransit = false


    }, error => {
      this.loginError = 'Incorrect username or password.';
      console.log(error);
    });
  }

  // goToRegister() {
  //   this.router.navigateByUrl('/register');
  //   console.log("Register clicked");

  // }


  // public isAuthenticated(): boolean
  // {
  //   let token = sessionStorage.getItem("currentUser")
  //                 ? JSON.parse(sessionStorage.getItem("currentUser")).token
  //                 : null;

  //                 console.log('token:', token)

  //   if (this.jwtHelperService.isTokenExpired()) {
  //     return false
  //   } else {
  //     return true
  //   }
  // }
}
