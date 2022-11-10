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
  positionsArray: any[] = [];
  pointsArray: any[] = [];
  positions: any[] = [];


  constructor(private leaderboard: LeaderboardService) { }


  ngOnInit(): void {
    this.leaderboard.getUsersForLeaderboard().subscribe(
      (res: LeaderboardUser[]) => {
        this.allUsers = res

        for (let i = 0; i < this.allUsers.length; i++) {
          this.pointsArray.push(this.allUsers[i].points)
        }

        this.positions = this.pointsArray.reduce((acc, point, index) => {
          if (point !== this.pointsArray[index - 1]) {
            acc.push(acc[index - 1] + 1 || 1);
          } else {
            acc.push(acc[index - 1]);
          }
          return acc;
        }, []);


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
