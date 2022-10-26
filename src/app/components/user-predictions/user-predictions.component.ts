import { Component, OnInit } from '@angular/core';
import { PredictionService } from '../../services/prediction.service';
import { Router } from '@angular/router';
import { User } from '../../classes/user-model';
import { AdminService } from '../../services/admin.service';
import { AllGamesService } from '../../services/all-games.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-user-predictions',
  templateUrl: './user-predictions.component.html',
  styleUrls: ['./user-predictions.component.scss']
})
export class UserPredictionsComponent implements OnInit {

  isDarkEnable = false;
  // user: User = new User();
  userId: number = 0;
  userGames: any[] = null;
  playedGames: any[] = null;
  userName: string = "";
  sortedGames: any[] = [];
  boostersLeft: number = null;
  points: number = null;

  constructor(private allGamesService: AllGamesService,
    private predictionService: PredictionService,
    private adminService: AdminService,
    public authenticationService: AuthenticationService,
    public router: Router) { }

  ngOnInit(): void {

    if (sessionStorage.getItem("currentUser") != null) {
      this.userId = JSON.parse(sessionStorage.getItem("currentUser")).id;
      this.boostersLeft = JSON.parse(sessionStorage.getItem("currentUser")).activeBoosters;
    }


    this.predictionService.fetchUserPredictions(this.userId).subscribe(
      (response) => {
        this.userGames = response;
        console.log('this.userGames:', this.userGames)

        this.points = this.userGames.map(el => el.points).reduce((a, b) => {
          return a + b
        }, 0)

      },
      (error) => {
        console.log("Error while fetching user predictions", error);

      }
    )

  }

}
