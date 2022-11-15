import { Component, OnInit } from '@angular/core';
import {User} from "../../classes/user-model";
import {AdminService} from "../../services/admin.service";
import {Router} from "@angular/router";
import { Team } from '../../classes/team';
import { TablesService } from '../../services/tables.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  isDarkEnable = false;
  userList: Array<User> = [];
  allTeams: Team[] = null;

  constructor(private tableService: TablesService, private adminService: AdminService, private router: Router) { }

  ngOnInit(): void {
    this.adminService.findAllUsers().subscribe(data => {
      this.userList = data;
      console.log('this.userList:', this.userList)
    });

    this.tableService.getAllTeams().subscribe(
      (response: Team[]) => {
        this.allTeams = response;
        console.log('this.allTeams:', this.allTeams)
      })

  }

  detail(user: User) {

    this.router.navigate(['/details', user.id], {state: user});
  }

}
