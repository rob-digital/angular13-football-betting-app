import { Component } from '@angular/core';
import {User} from "../../classes/user-model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent {

  user: User = new User;

  constructor(private router: Router) {
    //works only in the constructor.
    this.user = Object.assign(new User(), this.router.getCurrentNavigation()?.extras.state);
    console.log('this.user:', this.user)
  }

}
