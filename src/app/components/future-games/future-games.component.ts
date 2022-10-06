import { Component, OnInit } from '@angular/core';
import { AllGamesService } from '../../services/all-games.service';

@Component({
  selector: 'app-future-games',
  templateUrl: './future-games.component.html',
  styleUrls: ['./future-games.component.scss']
})
export class FutureGamesComponent implements OnInit {

  isDarkEnable = false;
  allGames: any[] = [];
  gamesByDatesArray: any[] = [];
  dailyGamesArray: any[] = null;
  flagsURL: string = "https://hatscripts.github.io/circle-flags/flags/";
  extension: string = ".svg";

  constructor(private futureGamesService: AllGamesService) { }

  ngOnInit(): void {

    this.futureGamesService.getAllGames().subscribe(
      (response) => {
        this.allGames = response
        // console.log('this.allGames:', this.allGames)
        const uniqueDates = new Set(this.allGames.map(el => el.matchDate))
        let allDatesArray = [...uniqueDates]

        let dailyGamesArray = [];
        for(let i=0;i<allDatesArray.length;i++){
          dailyGamesArray.push(this.allGames.filter((el, j) =>el.matchDate == allDatesArray[i]));
        }
        this.dailyGamesArray = dailyGamesArray;
        console.log('vals:', dailyGamesArray)

      },
      (error) => {
        console.log("Future games service error: ", error);
      }
    )
  }
}
