import { Component, OnInit } from '@angular/core';
import { PredictionService } from '../../services/prediction.service';
import { Router } from '@angular/router';
import { User } from '../../classes/user-model';

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
  userName: string = "";

  constructor(private predictionService: PredictionService, public router: Router) { }

  ngOnInit(): void {

    sessionStorage.getItem("currentUser") != null
      ? this.userId = JSON.parse(sessionStorage.getItem("currentUser")).id
      : null;


    this.predictionService.fetchUserPredictions(this.userId).subscribe(
      (response) => {
        this.userGames = response;
        console.log('this.userGames:', this.userGames)

        // this.userGames != null
        //   ? this.userName = this.userGames[0].user.username
        //   : null;

      },
      (error) => {
        console.log("Error while fetching user predictions", error);

      }
    )

  }

}
