import { Component, OnInit } from '@angular/core';
import {User} from "../../classes/user-model";
import {AdminService} from "../../services/admin.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  isDarkEnable = false;
  userList: Array<User> = [];

  constructor(private adminService: AdminService, private router: Router) { }

  ngOnInit(): void {
    this.adminService.findAllUsers().subscribe(data => {
      this.userList = data;
      console.log('this.userList :', this.userList )
    });
  }

  detail(user: User) {

    this.router.navigate(['/details', user.id], {state: user});
  }

}
