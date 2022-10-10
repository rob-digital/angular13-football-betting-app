import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { ScorePayload } from '../../classes/score-payload';

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
        console.log('this.allGamesADMIN:', this.allGames)
      },
      (error) => {
        console.log("admin-all-games error", error);

      }
    )
  }

  closeToastSuccess(e) {
    this.successMessage = ""
  }

  onInsertClick(event, i) {

    let gameId = this.allGames.find(el => el == this.allGames[i]).id;

  console.log('selectedOptionsTeam1:', this.selectedOptionsTeam1)
  console.log('selectedOptionsTeam2:', this.selectedOptionsTeam2)

  let payload: ScorePayload = {
    goalsTeam1: this.selectedOptionsTeam1[0],
    goalsTeam2: this.selectedOptionsTeam2[0],
  }

  this.adminService.submitGameScore(gameId, payload).subscribe(
    (res) => {
      fetch(location.href).then(response => {
        console.log(response.status)

        if (response.status == 200)
        this.selectedOptionsTeam1 = []
        this.selectedOptionsTeam2 = []

        // document.getElementById('gamesNoScore').hasChildNodes('tr').to

        // document.getElementsByTagName('tr')

        this.successMessage = "Score submitted successfully!";
          // document.querySelector('.modal-backdrop').setAttribute('data-bs-dismiss', 'modal')
      })
    },
    (error) => {
      console.log("Error while submitting a score to a game ", error);

    }
  )

  }

}
