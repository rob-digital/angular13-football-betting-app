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
  copyOfCurrentPredictionArrayWithGames: any[] = []
  numberOfElementsInEachArray: number[] = [];
  itemsInSlip: number = 0;

  payloadReady: any[] = [];
  payloadCount: number = 0;
  tooltip1_status: number[] = [];
  tooltip2_status: number[] = [];

  actualGameIndex: number = 0;
  slipText: string = "";
  thanks: string = "";

  booster: number = 0;
  userId: number = 0;


  constructor(private allGamesService: AllGamesService, private predictionService: PredictionService, public router: Router) { }

  ngOnInit(): void {

    if (sessionStorage.getItem("currentUser") == null) {
      this.router.navigateByUrl('/login');
      return;
    }

    this.userId = JSON.parse(sessionStorage.getItem("currentUser")).id;
    this.booster = JSON.parse(sessionStorage.getItem("currentUser")).activeBoosters;
    console.log('this.booster00000:', this.booster)



    setInterval(() => {
      const JWT = JSON.parse(sessionStorage.getItem("currentUser")).accessToken
      const jwtPayload = JSON.parse(window.atob(JWT.split('.')[1]))
      console.log(jwtPayload.exp);
    }, 1000)

    this.allGamesService.getAllGames(this.userId).subscribe(
      (response) => {
        console.log('response:', response)
        this.allGames = response
        this.allGames.sort((a, b) => a.id - b.id)
        console.log('this.allGames:', this.allGames)

        const uniqueDates = new Set(this.allGames.map(el => el.matchDate))
        let allDatesArray = [...uniqueDates]

        this.allDatesArray = allDatesArray
        // this.allDatesArray.reverse()
        console.log('allDatesArray:', allDatesArray)


        let sortGamesByDatesArray = [];
        for(let i=0;i<allDatesArray.length;i++){
          sortGamesByDatesArray.push(this.allGames.filter((el, j) =>el.matchDate == allDatesArray[i]));
        }
        this.sortGamesByDatesArray = sortGamesByDatesArray;
        this.sortGamesByDatesArray.forEach(el => el.sort((a, b) => a.id - b.id));

        for (let i = 0; i < this.sortGamesByDatesArray.length; i++) {
          this.numberOfElementsInEachArray.push(this.sortGamesByDatesArray[i].length)
        }

        console.log('this.sortGamesByDatesArray:', this.sortGamesByDatesArray)

        this.allGames.length == 0
        ? this.thanks = "Nothing to submit, thanks for taking part :)"
        : null
      },
      (error) => {
        console.log("All games error",  error);
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



  deleteFromSlip(el, i) {
    console.log('i111:', i)
    console.log('el:', el)
    console.log('currentPredictionsArray:', this.currentPredictionsArray)
    console.log(' this.booster111:',  this.booster)
    console.log('this.payloadReady:', this.payloadReady)
    // this.currentPredictionsArray.splice(i, 1);
    // console.log('this.currentPredictionsArrayddddddddddd:', this.currentPredictionsArray)

    let elementInPayloadReadyArray = this.payloadReady.find(el => el == this.currentPredictionsArray[i])
    console.log('elementInPayloadReadyArray:', elementInPayloadReadyArray)

   let indexInPayloadReadyArray = this.payloadReady.indexOf(elementInPayloadReadyArray)
   console.log('indexInPayloadReadyArray:', indexInPayloadReadyArray)

   console.log('this.copyOfCurrentPredictionArrayWithGames_DEL:', this.copyOfCurrentPredictionArrayWithGames)

   if (this.booster < 3 && this.booster >= 0) {
    // this.payloadReady.forEach(z => {
    //   if (z.game_id == i + 1 && z.usedBooster == 2) {
    //     z.usedBooster = 1
    //     this.booster += 1
    //   }
    // })
    if (this.payloadReady[indexInPayloadReadyArray].usedBooster == 2) {
      this.payloadReady[indexInPayloadReadyArray].usedBooster = 1
      this.booster += 1
    }
  }




  console.log('this.booster2222:', this.booster)

   if (indexInPayloadReadyArray > -1) this.payloadReady.splice(indexInPayloadReadyArray, 1)

  //  console.log('elementInPayloadReadyArray:', elementInPayloadReadyArray)
  //  console.log('indexInPayloadReadyArray:', indexInPayloadReadyArray)
   console.log('payloadReady:', this.payloadReady)



   let currentItemInSlip = document.querySelectorAll(".modalContent"+i)
   currentItemInSlip.forEach(el => el.remove())



   if (this.payloadReady.length == 0) {
     this.slipText = "Your slip is empty"
     document.getElementById('saveModal').style.display = 'none';
   } else {
     document.getElementById('saveModal').style.display = 'block';
     this.slipText = "You're about to submit the following games: ";
   }

   let elementInCurrentPredictionArray = this.currentPredictionsArray.find(el => el == this.currentPredictionsArray[i])
   let positionInCurrentPredictionArray = this.currentPredictionsArray.indexOf(elementInCurrentPredictionArray)
  //  console.log('positionInCurrentPredictionArray:', positionInCurrentPredictionArray)

   this.selectedOptionsTeam1.splice(positionInCurrentPredictionArray, 1)
  //  console.log('this.selectedOptionsTeam1:', this.selectedOptionsTeam1)
   this.selectedOptionsTeam2.splice(positionInCurrentPredictionArray, 1)
  //  console.log('this.selectedOptionsTeam2:', this.selectedOptionsTeam2)

   if (this.payloadReady.length == 0) {
    this.currentPredictionsArray.filter(el => el)
    this.selectedOptionsTeam1.filter(el => el)
    this.selectedOptionsTeam2.filter(el => el)


    }

    this.copyOfCurrentPredictionArrayWithGames.splice(positionInCurrentPredictionArray, 1)
    this.currentPredictionsArray.splice(positionInCurrentPredictionArray, 1)
    this.copyOfCurrentPredictionArrayWithGames
    // console.log('this.copyOfCurrentPredictionArrayWithGames:', this.copyOfCurrentPredictionArrayWithGames)

  }

  prepareItemsInSlipArray() {
    if (this.payloadReady.length > 0) {
      document.getElementById('saveModal').style.display = 'block';
    } else {
      document.getElementById('saveModal').style.display = 'none';
    }

    this.tooltip1_status.forEach(el => el = 0)
    this.tooltip2_status.forEach(el => el = 0)
  }

  calculateBooster(el, i) {

    let elementInPayloadReadyArray = this.payloadReady.find(el => el == this.currentPredictionsArray[i])
    console.log('elementInPayloadReadyArray:', elementInPayloadReadyArray)

   let indexInPayloadReadyArray = this.payloadReady.indexOf(elementInPayloadReadyArray)
    console.log('indexInPayloadReadyArray:', indexInPayloadReadyArray)
    console.log('iQQQ:', i)
    if (this.booster > 0 && this.booster <= 3) {
      // this.payloadReady.forEach(z => {
      //   if (z.game_id == i + 1 && z.usedBooster == 1) {
      //     z.usedBooster = 2
      //     this.booster -= 1
      //   }
      // })
      if (this.payloadReady[indexInPayloadReadyArray].usedBooster == 1) {
        this.payloadReady[indexInPayloadReadyArray].usedBooster = 2
        this.booster -= 1
      }
    }


      document.getElementsByClassName('starContainer')[indexInPayloadReadyArray].classList.add('hide')

      if (this.booster == 0)
        document.querySelectorAll('.starContainer').forEach(el => el. classList.add('hide'))

      console.log('this.booster:', this.booster)
      if (this.booster == 0) console.log("ZERO");

    console.log('payloadReady111:', this.payloadReady)


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
      usedBooster: 1
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
    let newArr: any = []
    for (let i of this.sortGamesByDatesArray)
    {
      newArr.push(i)
    }
    let arraysUntilSelected = newArr.reverse().slice(this.sortGamesByDatesArray.length - arrayIndex - 1)
    // console.log('arraysUntilSelected:', arraysUntilSelected)


    let newArrOfIndexes = []
    // console.log('arraysUntilSelected:', arraysUntilSelected.reduce((a, b) => a.length + b.length))
    for (let i = 0; i < arraysUntilSelected.length; i++) {
      newArrOfIndexes.push(arraysUntilSelected[i].length)
    }

    let noOfElementsUntilSelectedArray = newArrOfIndexes.reduce((a, b) => a + b)
    // console.log('noOfElementsUntilSelectedArray:', noOfElementsUntilSelectedArray)

    let actualGameIndex = (noOfElementsUntilSelectedArray + positionInArrayIndex - this.sortGamesByDatesArray[arrayIndex].length + 1)  // works with first array
    this.actualGameIndex = actualGameIndex - 1
    console.log('actualGameIndex:', this.actualGameIndex)
    this.copyOfCurrentPredictionArrayWithGames[gameId - 1] = this.allGames[this.actualGameIndex]
    console.log('this.copyOfCurrentPredictionArrayWithGames:', this.copyOfCurrentPredictionArrayWithGames)


    console.log('selectedOptionsTeam1:', this.selectedOptionsTeam1)
    console.log('selectedOptionsTeam2:', this.selectedOptionsTeam2)

    if (this.selectedOptionsTeam1[positionInArrayIndex] == null || this.selectedOptionsTeam2[positionInArrayIndex] == null) {

    }


    console.log('singlePredictionPayload:', singlePredictionPayload)


    this.currentPredictionsArray[gameId - 1] = singlePredictionPayload
    console.log('currentPredictionsArray:', this.currentPredictionsArray)

    this.payloadReady = this.currentPredictionsArray.filter(el => el);
    this.itemsInSlip = this.payloadReady.length;
    console.log('payloadReady:', this.payloadReady)

    this.payloadReady.length == 0
    ? this.slipText = "Your slip is empty"
    : this.slipText = "You're about to submit the following games: ";

    this.payloadCount = this.payloadReady.length

  }

  onClickSave() {
    this.predictionService.submitPredictions(this.payloadReady).subscribe(
      (res) => {

        fetch(location.href).then(response => {
          console.log(response.status)

          if (response.status == 200)
            this.successMessage = "Your predictions have been submitted successfully.\n GOOD LUCK!";
            // document.getElementById('predictionModal').setAttribute('data-bs-dismiss', 'modal')
            // document.querySelector('.modal-backdrop').setAttribute('data-bs-dismiss', 'modal')
            this.copyOfCurrentPredictionArrayWithGames = []
            this.payloadReady = []
            document.getElementsByClassName('gameTable')[this.actualGameIndex].remove();

            this.payloadReady.length == 0
              ? this.slipText = "Your slip is empty"
              : this.slipText = "You're about to submit the following games: ";

              this.allGames.length == 0
              ? this.thanks = "Nothing to submit, thanks for taking part :)"
              : null
        })
      },

      (error) => {
        this.errorMessage = "Error while submitting predictions.\n It is highly likely that your access token has expired. Please logout and login again. Try submitting your predictions again."
        console.log("Error while submitting predictions", error);

      }
    );
  }


}
