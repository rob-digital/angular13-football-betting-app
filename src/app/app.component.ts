import { Component, OnInit } from '@angular/core';
import { TablesComponent } from './tables/tables.component';
import { LoginService } from './services/login.service';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title: string = 'angular13-football-betting-app';
  isDarkEnable = false;
  // selected: boolean = false;
  // isActivePage: boolean = false;
  // navLinks: []
  // name: string = ""

  activeUser: boolean = false;

  constructor(public authenticationService: AuthenticationService, public router: Router){

  }
   ngOnInit() {

    if (localStorage.getItem("currentUser") != null) {
      this.authenticationService.currentUsername  = JSON.parse(localStorage.getItem("currentUser")).name;
    } else {
      this.authenticationService.currentUsername = null
    }
    // this.name = JSON.parse(localStorage['currentUser']);
    // console.log('this.name:', this.name)
    // console.log("rts", this.authenticationService.currentUsername);

   }

  //  onMenuLinkClick(event){
  //   // console.log(event.target.nodeName.addClass('activeLink'));
  //   event.target.style.background = "grey";
  //   // event.target.css('background' , "red");

  //  }
}

