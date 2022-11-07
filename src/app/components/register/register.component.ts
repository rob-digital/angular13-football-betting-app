import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/classes/user-model';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  isDarkEnable = false;
  user: User = new User();
  errorMessage: string = "";
  errorMessageName: string = null;
  errorMessageUsername: string = null;
  inTransit = false

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {

  }

  register() {
    this.inTransit = true

    if (this.user.password == null || this.user.password == "") {
      this.errorMessage = "Password cannot be empty";
      return;
    }
    if (this.user.name == null || this.user.name == "") {
      this.errorMessageName = "Name cannot be empty";
      return;
    }
    if (this.user.username == null || this.user.username == "") {
      this.errorMessageUsername = "Username cannot be empty";
      return;
    }

    this.authenticationService.register(this.user).subscribe(data => {

      if (data.response == 201) this.inTransit = false;

      this.router.navigate(['/login']);
    }, err => {
      if (err?.status === 409) {
        this.errorMessage = 'Username already exists.';
      } else {
        this.errorMessage = 'Unexpected error occurred.';
        console.log("Register error: ", err);
      }
    })
  }

}
