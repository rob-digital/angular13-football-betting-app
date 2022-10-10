import { Component, OnInit } from '@angular/core';
import { AllGamesService } from '../../services/all-games.service';
import { PredictionPayload } from '../../classes/prediction-payload';
import { User } from '../../classes/user-model';
import { Router } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { PredictionService } from '../../services/prediction.service';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss']
})
export class PredictionComponent implements OnInit {

  isDarkEnable = false;
  flagsURL: string = "https://hatscripts.github.io/circle-flags/flags/";
  extension: string = ".svg";
  visible = false;

  warningMessage: string = "";
  errorMessage: string = "";
  successMessage: string = "";

  allGames: any[] = null;
  values: number[] = [0,1,2,3,4,5,6,7,8,9]
  selectedOptionsTeam1: number[] = [];
  selectedOptionsTeam2: number[] = [];
  allDatesArray: any[] = []
  gamesByDatesArray: any[] = [];
  sortGamesByDatesArray: any[] = null;
  currentPredictionsArray: PredictionPayload[] = [];
  numberOfElementsInEachArray: number[] = [];

  payloadReady: any[] = []


  constructor(private allGamesService: AllGamesService, private predictionService: PredictionService, public router: Router) { }

  ngOnInit(): void {

    if (sessionStorage.getItem("currentUser") == null) {
      this.router.navigateByUrl('/login');
      return;
    }

    this.allGamesService.getAllGames().subscribe(
      (response) => {
        console.log('response:', response)
        this.allGames = response
        console.log('this.allGames:', this.allGames)

        const uniqueDates = new Set(this.allGames.map(el => el.matchDate))
        let allDatesArray = [...uniqueDates]

        this.allDatesArray = allDatesArray
        console.log('allDatesArray:', allDatesArray)

        let sortGamesByDatesArray = [];
        for(let i=0;i<allDatesArray.length;i++){
          sortGamesByDatesArray.push(this.allGames.filter((el, j) =>el.matchDate == allDatesArray[i]));
        }
        this.sortGamesByDatesArray = sortGamesByDatesArray;
        console.log('this.sortGamesByDatesArray:', this.sortGamesByDatesArray)

        for (let i = 0; i < this.sortGamesByDatesArray.length; i++) {
          this.numberOfElementsInEachArray.push(this.sortGamesByDatesArray[i].length)
        }
        console.log('this.numberOfElementsInEachArray:', this.numberOfElementsInEachArray)
      },
      (error) => {
        console.log("All games error");
      }
    )
  }

  closeToastWarning(e) {
    this.visible = !this.visible;
    this.warningMessage = ""
  }

  closeToastError(e) {
    this.errorMessage = ""
  }

  closeToastSuccess(e) {
    this.successMessage = ""
  }

  onClickAddToSlip(event, positionInArrayIndex, arrayIndex) {

    let gameId = this.allGames.find(el => el == this.sortGamesByDatesArray[arrayIndex][positionInArrayIndex]).id;
    console.log('this.allGames:', this.allGames)


    let userId: number = 0;
    if (sessionStorage.getItem("currentUser") != null) {
      userId  = JSON.parse(sessionStorage.getItem("currentUser")).id;
    }

    let singlePredictionPayload: PredictionPayload = {
      user_id: userId,
      game_id: gameId,
      prediction1: this.selectedOptionsTeam1[gameId - 1],
      prediction2: this.selectedOptionsTeam2[gameId - 1],
    }
    // if (this.selectedOptionsTeam1[positionInArrayIndex] == null || this.selectedOptionsTeam2[positionInArrayIndex] == null)
    // {
    // console.log('gameId:', gameId)

    //   this.warningMessage = "You cannot add empty value to the slip"
    //   return;
    // }
    if (singlePredictionPayload.prediction1 == null || singlePredictionPayload.prediction2 == null)
    {
    console.log('gameId:', gameId)

      this.warningMessage = "You cannot add empty value to the slip"
      return;
    }
    // let newArr: any = []
    // for (let i of this.sortGamesByDatesArray)
    // {
    //   newArr.push(i)
    // }
    // let arraysUntilSelected = newArr.reverse().slice(this.sortGamesByDatesArray.length - arrayIndex - 1)
    // // console.log('arraysUntilSelected:', arraysUntilSelected)


    // let newArrOfIndexes = []
    // // console.log('arraysUntilSelected:', arraysUntilSelected.reduce((a, b) => a.length + b.length))
    // for (let i = 0; i < arraysUntilSelected.length; i++) {
    //   newArrOfIndexes.push(arraysUntilSelected[i].length)
    // }

    // let noOfElementsUntilSelectedArray = newArrOfIndexes.reduce((a, b) => a + b)
    // // console.log('noOfElementsUntilSelectedArray:', noOfElementsUntilSelectedArray)

    // let actualGameIndex = (noOfElementsUntilSelectedArray + positionInArrayIndex - this.sortGamesByDatesArray[arrayIndex].length + 1)  // works with first array
    // console.log('actualGameIndex:', actualGameIndex)


    console.log('selectedOptionsTeam1:', this.selectedOptionsTeam1)
    console.log('selectedOptionsTeam2:', this.selectedOptionsTeam2)

    if (this.selectedOptionsTeam1[positionInArrayIndex] == null || this.selectedOptionsTeam2[positionInArrayIndex] == null) {

    }


    console.log('singlePredictionPayload:', singlePredictionPayload)


    this.currentPredictionsArray[gameId - 1] = singlePredictionPayload
    console.log('currentPredictionsArray:', this.currentPredictionsArray)

    this.payloadReady = this.currentPredictionsArray.filter(el => el);
    console.log('payloadReady:', this.payloadReady)
  }

  onClickSave() {
    this.predictionService.submitPredictions(this.payloadReady).subscribe(
      (res) => {

        fetch(location.href).then(response => {
          console.log(response.status)

          if (response.status == 200)
            this.successMessage = "Your predictions have been submitted successfully.\n GOOD LUCK!";
            document.getElementById('predictionModal').setAttribute('data-bs-dismiss', 'modal')
            // document.querySelector('.modal-backdrop').setAttribute('data-bs-dismiss', 'modal')

        })
      },

      (error) => {
        this.errorMessage = "Error while submitting predictions.\n It is highly likely that your access token has expired. Please logout and login again. Try submitting your predictions again."
        console.log("Error while submitting predictions", error);

      }
    );
  }


}
