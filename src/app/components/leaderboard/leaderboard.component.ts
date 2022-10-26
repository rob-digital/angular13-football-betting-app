import { Component, OnInit } from '@angular/core';
import { LeaderboardService } from '../../services/leaderboard.service';
import { LeaderboardUser } from '../../classes/leaderboard-user';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {

  allUsers: LeaderboardUser[] = [];
  isDarkEnable = false;


  constructor(private leaderboard: LeaderboardService) { }


  ngOnInit(): void {
    this.leaderboard.getUsersForLeaderboard().subscribe(
      (res) => {
        this.allUsers = res

      },
      (error) => {
        console.log("Leaderboard display error", error);

      }
    )
  }

}
