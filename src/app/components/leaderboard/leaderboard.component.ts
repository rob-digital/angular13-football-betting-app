import { Component, OnInit } from '@angular/core';
import { LeaderboardService } from '../../services/leaderboard.service';
import { LeaderboardUser } from '../../classes/leaderboard-user';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {

  allUsers: LeaderboardUser[] = null;
  isDarkEnable = false;
  pointsCalculated: boolean = false;


  constructor(private leaderboard: LeaderboardService) { }


  ngOnInit(): void {
    this.leaderboard.getUsersForLeaderboard().subscribe(
      (res: LeaderboardUser[]) => {
        this.allUsers = res

        for (let user of this.allUsers) {
          if (user.points > 0) {
            this.pointsCalculated = true
          }
        }
      },
      (error) => {
        console.log("Leaderboard display error", error);

      }
    )
  }

}
