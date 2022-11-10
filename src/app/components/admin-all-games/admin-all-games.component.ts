import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { ScorePayload } from '../../classes/score-payload';
import { GameStatusEnum } from '../../classes/game-status-enum';

@Component({
  selector: 'app-admin-all-games',
  templateUrl: './admin-all-games.component.html',
  styleUrls: ['./admin-all-games.component.scss']
})

// this brings all games without the actual score
export class AdminAllGamesComponent implements OnInit {

  isDarkEnable = false;
  allGames: any[] = null;
  values: number[] = [0,1,2,3,4,5,6,7,8,9];
  selectedOptionsTeam1: number[] = []
  selectedOptionsTeam2: number[] = []
  successMessage: string = ""

  constructor(private adminService: AdminService, private router: Router) { }

  ngOnInit(): void {

    this.adminService.findGamesWithoutScore().subscribe(
      (response) => {
        this.allGames = response;
      },
      (error) => {
        console.log("admin-all-games error", error);

      }
    )
  }

  closeToastSuccess(e) {
    this.successMessage = ""
  }

  goToGamesWithScores() {
    this.router.navigateByUrl('/admin/allgamesplayed');
  }

  goToAllUsers() {
    this.router.navigateByUrl('/admin/allusers');
  }
  goToAllTeams() {
    this.router.navigateByUrl('/admin/allteams');
  }

  onInsertClick(event, i) {

    let gameId = this.allGames.find(el => el == this.allGames[i]).id;


  let payload: ScorePayload = {
    goalsTeam1: this.selectedOptionsTeam1[gameId - 1],
    goalsTeam2: this.selectedOptionsTeam2[gameId - 1],
    status: GameStatusEnum.CALCULATED
  }

  this.adminService.submitGameScore(gameId, payload).subscribe(
    (res) => {
      fetch(location.href).then(response => {

        if (response.status == 200) {
          this.selectedOptionsTeam1 = []
          this.selectedOptionsTeam2 = []
          this.successMessage = "Score submitted successfully!";
          setTimeout(() => {
            this.successMessage = ""
          }, 2000);
        }

      })
    },
    (error) => {
      console.log("Error while submitting a score to a game ", error);

    }
  )

  }

}
