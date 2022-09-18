import { Component, OnInit } from '@angular/core';
import { TablesComponent } from './tables/tables.component';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title: string = 'angular13-football-betting-app';
  isDarkEnable = false;

  constructor(public loginService: LoginService){}
   ngOnInit() {


}


}

