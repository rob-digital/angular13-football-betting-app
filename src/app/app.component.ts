import { Component, OnInit } from '@angular/core';
import { TablesComponent } from './components/tables/tables.component';
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
  activeUser: boolean = false;

  constructor(public authenticationService: AuthenticationService, public router: Router){

  }
   ngOnInit() {

    if (sessionStorage.getItem("currentUser") != null) {
      this.authenticationService.currentUsername  = JSON.parse(sessionStorage.getItem("currentUser")).name;
      this.authenticationService.userRole = JSON.parse(sessionStorage.getItem("currentUser")).role;
    } else {
      this.authenticationService.currentUsername = null
    }

    setInterval(() => {

      let convertDateTime = function(num) { return ('00'+num).slice(-2) };
      let currentTime;
      currentTime = new Date();
      currentTime = new Date();
      currentTime = convertDateTime(currentTime.getUTCHours() + 1)      + ':' +
      convertDateTime(currentTime.getUTCMinutes())    + ':' +
      convertDateTime(currentTime.getUTCSeconds());

       let logoutTime = "23:58:00"

       if (currentTime == logoutTime) {
        // this.authenticationService.logout()
        this.authenticationService.removeUserFromSession()
        this.router.navigate(['/login']);
      }

    }, 1000)
   }
}

