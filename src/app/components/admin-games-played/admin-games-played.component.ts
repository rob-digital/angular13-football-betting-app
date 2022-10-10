import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-games-played',
  templateUrl: './admin-games-played.component.html',
  styleUrls: ['./admin-games-played.component.scss']
})
export class AdminGamesPlayedComponent implements OnInit {

  isDarkEnable = false;
  gamesPlayed: any[] = null;

  constructor(private adminService: AdminService, private router: Router) { }

  ngOnInit(): void {

    this.adminService.findPlayedGames().subscribe(
      (response) => {
        this.gamesPlayed = response;
        console.log('this.gamesPlayed:', this.gamesPlayed)
      },
      (error) => {
        console.log("admin-games-played", error);

      }
    )
  }

  onCalculateClick() {
    console.log(this.gamesPlayed);

  }
}

