import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { User } from '../../classes/user-model';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isDarkEnable = false;
  user: User = new User();
  loginError: string = ""
  inTransit = false;

  constructor(public authenticationService: AuthenticationService, public router: Router) { }

  ngOnInit(): void {

  //   if ( document.URL.includes("login") ) {
  //    console.log("Login here");
  //    this.authenticationService.removeUserFromSession();
  // }


    if (this.authenticationService.currentUser == null || this.authenticationService.currentUsername == null)
   {
      history.pushState(null, '', location.href);
      window.onpopstate = function () {
        history.go(1);
      };
  }
}

  login(event: any) {
    this.inTransit = true
    this.authenticationService.login(this.user).subscribe(data => {

      if (data.response == 201) this.inTransit = false;


    }, error => {
      if (error?.status === 500) {
        console.log("Server error! Data not available!");
        this.loginError = "Server error! Data not available!";

      } else if (error?.status === 0) {
        console.log(error.statusText);
        this.loginError = error.statusText + ", server is not responding.";
      }

      else {
        this.loginError = 'Incorrect username or password.';
        console.log(error);

      }
    });
  }

}
