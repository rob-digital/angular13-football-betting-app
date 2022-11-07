import { Component, OnInit } from '@angular/core';
import { AllGamesService } from '../../services/all-games.service';
import { PredictionPayload } from '../../classes/prediction-payload';
import { User } from '../../classes/user-model';
import { Router } from '@angular/router';
import { PredictionService } from '../../services/prediction.service';
import { bindCallback, Observable, Subscription } from 'rxjs';
import { StateSlipService } from '../../services/state-slip.service';
import { AuthenticationService } from '../../services/authentication.service';

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
  selectedOptionsTeam1: any[] = [];
  selectedOptionsTeam2: any[] = [];
  allDatesArray: any[] = []
  gamesByDatesArray: any[] = [];
  sortGamesByDatesArray: any[] = null;
  numberOfElementsInEachArray: number[] = [];


  payloadCount: number = 0;
  tooltip1_status: number[] = [];
  tooltip2_status: number[] = [];

  actualGameIndex: number = 0;
  slipText: string = "";
  thanks: string = "";

  itemsInSlip: number = 0;
  booster: number = 0;
  userId: number = 0;
  inTransit: boolean = false;
  todaysDate: Date = null;
  allDatesWithDays: any[] = [];
  timeZones: any[] = [];

  // prepareGamesToSlip: any[] = []
  gamesOnSlip: any[] = []
  // preparePayload: any[] = []
  // payloadToSubmit: PredictionPayload[] = []
  payloadReady: PredictionPayload[] = [];
  unsortedGames: any[] = []
  unsortedPayload: any[] = []
  gamesOnSlipLength: number = null;

  // subscription: Subscription;


  constructor(private allGamesService: AllGamesService,
    public authenticationService: AuthenticationService,
    private predictionService: PredictionService,
    private stateOfSlip: StateSlipService,
    public router: Router) { }

  ngOnInit(): void {

    if (sessionStorage.getItem("currentUser") == null) {
      this.router.navigateByUrl('/login');
      return;
    }

    this.userId = JSON.parse(sessionStorage.getItem("currentUser")).id;
    this.booster = JSON.parse(sessionStorage.getItem("currentUser")).activeBoosters;

    this.initiatePage();

    setInterval(() => {

      var convertDateTime = function(num) { return ('00'+num).slice(-2) };
      var todaysDate;
      todaysDate = new Date();
      todaysDate = todaysDate.getUTCFullYear()         + '-' +
                    convertDateTime(todaysDate.getUTCMonth() + 1)  + '-' +
                    convertDateTime(todaysDate.getUTCDate())       + 'T' +
                    convertDateTime(todaysDate.getUTCHours())      + ':' +
                    convertDateTime(todaysDate.getUTCMinutes())    + ':' +
                    convertDateTime(todaysDate.getUTCSeconds());


      var currentTime;

      this.todaysDate = todaysDate

      if (this.sortGamesByDatesArray != null) {
        for (let i = 0; i < this.sortGamesByDatesArray.length; i++) {

          this.sortGamesByDatesArray[i].forEach((element, j) => {
            if (element.matchDateTime == todaysDate) {
              let gameStartsNow = this.allGames.find(el => el.matchDateTime == todaysDate)
              let indexInAllGames = this.allGames.indexOf(gameStartsNow);
              let indexInAllDatesArray = this.sortGamesByDatesArray[i].indexOf(gameStartsNow);

              if (element.id == gameStartsNow.id) {
                this.sortGamesByDatesArray[i].splice(indexInAllDatesArray, 1)
                this.allGames.splice(indexInAllGames, 1)
                document.querySelectorAll('.singleGame' + gameStartsNow.id).forEach(el => el.remove())
                // this.initiatePage();
                this.saveDataToSlipState([], [], [], [])

                this.selectedOptionsTeam1 = []
                this.selectedOptionsTeam2 = []

                this.slipText = "One of the games from your slip has already started. Your slip was cleared. Please place your predictions again."
                document.getElementById('saveModalButton').style.display = 'none';

                this.initiatePage()

                if (this.gamesOnSlip) {
                  let indexInGameOnSlip = this.gamesOnSlip.indexOf(gameStartsNow)
                    let indexInStateOfUnsortedGames: number = 0
                }
              }
            }
          });

          if (this.sortGamesByDatesArray[i].length == 0) {
            document.querySelectorAll('.dateIndicator' + i).forEach(el => el.remove())
            document.querySelectorAll('.currentGamesContainer' + i).forEach(el => el.remove())

          }
        }
      }
    }, 1000)

  }

  initiatePage() {

    this.saveDataToSlipState([], [], [], [])

    this.allGamesService.fetchNotPredictedGames(this.userId).subscribe(
      (response) => {
        this.allGames = response

        const uniqueDates = new Set(this.allGames.map(el => el.matchDateTime.slice(0, -9)))
        let allDatesArray = [...uniqueDates]

        this.allDatesArray = allDatesArray

        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        this.allDatesWithDays = []

        let sortGamesByDatesArray = [];
        for(let i=0;i<allDatesArray.length;i++){
          sortGamesByDatesArray.push(this.allGames.filter((el, j) =>el.matchDateTime.slice(0, -9) == allDatesArray[i]));
          let day = days[new Date(allDatesArray[i].split('-')).getDay()];
          let date = allDatesArray[i].split('-').reverse().join('.');
          let obj = {};

          Object.assign(obj, { day: day, date: date})

          this.allDatesWithDays.push(obj)
        }



        for(let i = 0; i < sortGamesByDatesArray.length; i++) {
          for(let j = 0; j < sortGamesByDatesArray[i].length; j++) {
            let obj = {};
            let buildPuneTimeHours = Number(sortGamesByDatesArray[i][j].matchDateTime.slice(11, -6)) + 5 == 24 ? "00": Number(sortGamesByDatesArray[i][j].matchDateTime.slice(11, -6)) + 5
            let buildZurichTimeHours = Number(sortGamesByDatesArray[i][j].matchDateTime.slice(11, -6)) + 1
            let buildPuneTimeMinutes = Number(sortGamesByDatesArray[i][j].matchDateTime.slice(14, -3)) + 30
            let buildPuneWholeTime = (sortGamesByDatesArray[i][j].matchDateTime).replace(sortGamesByDatesArray[i][j].matchDateTime.slice(11, -6), buildPuneTimeHours)
            let buildZurichWholeTime = (sortGamesByDatesArray[i][j].matchDateTime).replace(sortGamesByDatesArray[i][j].matchDateTime.slice(11, -6), buildZurichTimeHours)

            Object.assign(obj, {
              gameId: sortGamesByDatesArray[i][j].id,
              gameTimeGMT: sortGamesByDatesArray[i][j].matchDateTime,
              gameTimeIST: buildPuneWholeTime,
              gameTimeCET: buildZurichWholeTime,
            })
            this.timeZones[sortGamesByDatesArray[i][j].id] = obj
          }

        }

        this.sortGamesByDatesArray = sortGamesByDatesArray;
        this.sortGamesByDatesArray.forEach(el => el.sort((a, b) => a.id - b.id));

        for (let i = 0; i < this.sortGamesByDatesArray.length; i++) {
          this.numberOfElementsInEachArray.push(this.sortGamesByDatesArray[i].length)
        }

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

  deleteFromSlip(e ,i) {

    let clickedPrediction = this.unsortedPayload.find(el => el == this.payloadReady[i])
    let gameIndex = this.unsortedPayload.indexOf(clickedPrediction)
    let gameId = clickedPrediction.game_id

    this.selectedOptionsTeam1[gameId-1] = null
    this.selectedOptionsTeam2[gameId-1] = null

    if (this.booster < 3 && this.booster >= 0) {

      if (this.unsortedPayload[gameIndex].boostScoreXTimes == 2) {
        this.unsortedPayload[gameIndex].boostScoreXTimes = 1
        this.booster += 1
      }
    }

    this.unsortedPayload[gameIndex] = null
    this.unsortedGames[gameIndex] = null

    this.payloadReady = this.unsortedPayload.filter(el => el)
    this.gamesOnSlip = this.unsortedGames.filter(el => el)

    if (this.booster == 0)
      document.querySelectorAll('.starContainer').forEach(el => el.classList.add('hide'))

    document.querySelectorAll(".modalContent"+gameId).forEach(el => el.remove());

    if (this.payloadReady.length == 0) {
       this.slipText = "Your slip is empty"
       document.getElementById('saveModalButton').style.display = 'none';
     } else {
       document.getElementById('saveModalButton').style.display = 'block';
       this.slipText = "You're about to submit the following games: ";
     }

     this.saveDataToSlipState(this.unsortedPayload, this.unsortedGames, this.payloadReady, this.gamesOnSlip)

  }

  closedModal() {
    // this.subscription.unsubscribe();
    let localUnsortedPayload = []
    let localPayloadToSubmit = []

    let localUnsortedGames = []
    let localGamesOnSlip = []

    localGamesOnSlip = this.gamesOnSlip
    localUnsortedGames = this.unsortedGames
    localPayloadToSubmit = this.payloadReady
    localUnsortedPayload = this.unsortedPayload

    this.saveDataToSlipState(localUnsortedPayload, localUnsortedGames, localPayloadToSubmit, localGamesOnSlip)

  }

  prepareItemsInSlip() {

    let localUnsortedPayload = []
    let localPayloadToSubmit = []

    let localUnsortedGames = []
    let localGamesOnSlip = []

    this.stateOfSlip.getPayloadFromSlipState().subscribe(
      (response: PredictionPayload[]) => {
        localPayloadToSubmit = response
        this.payloadReady = localPayloadToSubmit

      },
      () => {}
    );

   this.stateOfSlip.getGamesFromSlipState().subscribe(
      (response) => {
        localGamesOnSlip = response
        this.gamesOnSlip = localGamesOnSlip
      },
      () => {}
    )

    this.stateOfSlip.getUnsortedPayloadFromSlipState().subscribe(
      (response) => {
        localUnsortedPayload = response
        this.unsortedPayload = localUnsortedPayload
      },
      () => {}
    );

    this.stateOfSlip.getUnsortedGamesFromSlipState().subscribe(
      (response) => {
        localUnsortedGames = response
        this.unsortedGames = localUnsortedGames
      },
      () => {}
    );

    this.gamesOnSlip.sort((a, b) => a.id - b.id)
    this.payloadReady.sort((a, b) => a.game_id - b.game_id)



    if (this.gamesOnSlip.length == 0) {
      this.slipText = "Your slip is empty"
      document.getElementById('saveModalButton').style.display = 'none';
    } else {
      document.getElementById('saveModalButton').style.display = 'block';
      this.slipText = "You're about to submit the following games: ";
    }
  }

  calculateBooster(el, i) {

  let clickedPrediction = this.unsortedPayload.find(el => el == this.payloadReady[i])
  let gameId =  clickedPrediction.game_id
  let gameIndex = this.unsortedPayload.indexOf(clickedPrediction)

    if (this.booster > 0 && this.booster <= 3) {

      if (this.unsortedPayload[gameIndex].boostScoreXTimes == 1) {
        this.unsortedPayload[gameIndex].boostScoreXTimes = 2
        this.booster -= 1

        let localStarIcon = document.querySelector('.starContainer' + gameId)
        localStarIcon.classList.add('hide')

        let localTimeTwoIcon = document.querySelector('.timesTwo' + gameId)
        localTimeTwoIcon.classList.remove('invisible')
      }
    }

    this.payloadReady = this.unsortedPayload.filter(el => el)
    this.gamesOnSlip = this.unsortedGames.filter(el => el)

      if (this.booster == 0)
        document.querySelectorAll('.starContainer').forEach(el => el.classList.add('hide'))

  }


  onClickAddToSlip(event, positionInArrayIndex, arrayIndex) {

      let localUnsortedPayload = []
      let localPayloadToSubmit = []
      let localUnsortedGames = []
      let localGamesOnSlip = []

      this.stateOfSlip.getGamesFromSlipState().subscribe(
        (response) => {
          response != null ? localGamesOnSlip = response : localGamesOnSlip = []
        },
        () => {}
      )

      this.stateOfSlip.getPayloadFromSlipState().subscribe(
        (response) => {
          response != null ? localPayloadToSubmit = response : localPayloadToSubmit = []
        },
        () => {}
      )

      this.stateOfSlip.getUnsortedPayloadFromSlipState().subscribe(
        (response) => {
          response != null ? localUnsortedPayload = response : localUnsortedPayload = []
        },
        () => {}
      );

      this.stateOfSlip.getUnsortedGamesFromSlipState().subscribe(
        (response) => {
          response != null ? localUnsortedGames = response : localUnsortedGames = []
        },
        () => {}
      );


    this.tooltip1_status.forEach(el => el = 0)
    this.tooltip2_status.forEach(el => el = 0)

    let gameId = this.allGames.find(el => el == this.sortGamesByDatesArray[arrayIndex][positionInArrayIndex]).id;

    let userId: number = 0;
    if (sessionStorage.getItem("currentUser") != null) {
      userId  = JSON.parse(sessionStorage.getItem("currentUser")).id;
    }

    let singlePredictionPayload: PredictionPayload = {
      user_id: userId,
      game_id: gameId,
      prediction1: this.selectedOptionsTeam1[gameId - 1],
      prediction2: this.selectedOptionsTeam2[gameId - 1],
      boostScoreXTimes: 1
    }

    if (singlePredictionPayload.prediction1 == null || singlePredictionPayload.prediction2 == null)
    {
      this.warningMessage = "You cannot add empty value to the slip"
      return;
    }

    let chosenGame = this.allGames.find(el => el.id == gameId)
    localUnsortedGames[gameId] = chosenGame

    let gamesToDisplayOnSlip = localUnsortedGames.filter(el => el)

    localUnsortedPayload[gameId] = singlePredictionPayload
    let payloadToSubmit = localUnsortedPayload.filter(el => el)

    this.saveDataToSlipState(localUnsortedPayload, localUnsortedGames, payloadToSubmit, gamesToDisplayOnSlip)

    this.stateOfSlip.getGamesFromSlipState().subscribe(
      (response) => {
        this.gamesOnSlipLength = response.length
      }
    );

  }

  onClickSave() {

    this.inTransit = true;

    this.predictionService.submitPredictions(this.payloadReady).subscribe(
      (res) => {

        fetch(location.href).then(response => {

          if (response.status == 200) {

            this.inTransit = false

            let newSessionData = JSON.parse(sessionStorage.getItem('currentUser'));
            newSessionData.activeBoosters = this.booster;
            sessionStorage.setItem('currentUser', JSON.stringify(newSessionData));

            document.querySelectorAll(".modalContent").forEach(el =>  el.remove())

            // this.payloadToSubmit = []
            this.gamesOnSlip = []
            this.payloadReady = []
            // this.gamesToSubmit = []
            // this.gamesToSubmitFiltered = []
            this.selectedOptionsTeam1 = []
            this.selectedOptionsTeam2 = []
            this.gamesOnSlipLength = null
          // this.currentPredictionsArray = []
          if (this.payloadReady.length == 0) {
            this.slipText = "Your slip is empty"
            document.getElementById('saveModalButton').style.display = 'none';
          } else {
            document.getElementById('saveModalButton').style.display = 'block';
            this.slipText = "You're about to submit the following games: ";
          }

            this.successMessage = "Your predictions have been submitted successfully.\n GOOD LUCK!";

            this.saveDataToSlipState([], [], [], [])

            this.initiatePage();

          }
        })
      },

      (error) => {
        this.errorMessage = "Error while submitting predictions.\n It is highly likely that your access token has expired. Please logout and login again. Try submitting your predictions again."
        console.log("Error while submitting predictions", error);

      }
    );
  }

  saveDataToSlipState(localUnsortedPayload, localUnsortedGames,  localPayloadToSubmit, localGamesOnSlip ) {

    this.stateOfSlip.addUnsortedPayloadToSlipState(localUnsortedPayload);
    this.stateOfSlip.addUnsortedGamesToSlipState(localUnsortedGames);

    this.stateOfSlip.addPayloadToSlipState(localPayloadToSubmit);
    this.stateOfSlip.addGamesToSlipState(localGamesOnSlip);
  }

  ngOnDestroy() {
    this.saveDataToSlipState([], [], [], [])

  }

}
