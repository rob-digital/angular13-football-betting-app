import { Component, OnInit } from '@angular/core';
import { TablesComponent } from './components/tables/tables.component';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title: string = 'angular13-football-betting-app';
  isDarkEnable = false;
  selected: boolean = false;
  isActivePage: boolean = false;
navLinks: []
  constructor(public loginService: LoginService){}
   ngOnInit() {

     let navLinks = Array.from(document.querySelectorAll('a'));
     console.log('navLinks:', navLinks)
     document.links.length
     console.log('document.links.length:', document.links.length)
     document.links.item
     console.log('document.links.item:', document.links.item)
   }

  //  onMenuLinkClick(event){
  //   // console.log(event.target.nodeName.addClass('activeLink'));
  //   event.target.style.background = "grey";
  //   // event.target.css('background' , "red");

  //  }
}

