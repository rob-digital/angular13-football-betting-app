import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
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
  successMessage: string = "";

  constructor(private adminService: AdminService, private router: Router) { }

  ngOnInit(): void {
    this.initiatePage();
  }


  initiatePage() {
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

  closeToastSuccess(e) {
    this.successMessage = ""
  }

  goToGamesWithoutScores() {
    this.router.navigateByUrl('/admin/noscore');
  }
  goToAllUsers() {
    this.router.navigateByUrl('/admin/allusers');
  }


  onCalculateClick(e, i) {
    console.log(this.gamesPlayed);
    console.log(i);

    let gameId = this.gamesPlayed.find(el => el == this.gamesPlayed[i]).id;

    let payload = {
      gameId
    }

    this.adminService.calculatePointsForGame(gameId, payload).subscribe(

        (res) => {
          fetch(location.href).then(response => {
            console.log(response.status)
            if (response.status == 200) {
              this.successMessage = "Points calculated"
              this.initiatePage();

            }
        })
      },
      (error) => {
        console.log("Error while trying to calculate points");

      }
    )


  }
}

