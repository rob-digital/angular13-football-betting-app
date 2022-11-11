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
  // flagsURL: string = "https://hatscripts.github.io/circle-flags/flags/";
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
  tooltip3_status: number[] = [];

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
  gamesIdsOnSlip: number[] = [];
  todaysDateAsNumber: number = 0

  // subscription: Subscription;


  constructor(private allGamesService: AllGamesService,
    public authenticationService: AuthenticationService,
    private predictionService: PredictionService,
    private stateOfSlip: StateSlipService,
    public router: Router) { }

  ngOnInit(): void {

    let convertDateTime = function(num) { return ('00'+num).slice(-2) };
    let todaysDateAsNumber;
    todaysDateAsNumber = new Date();
    todaysDateAsNumber = todaysDateAsNumber.getUTCFullYear()         +
                  convertDateTime(todaysDateAsNumber.getUTCMonth() + 1)  +
                  convertDateTime(todaysDateAsNumber.getUTCDate())       +
                  convertDateTime(todaysDateAsNumber.getUTCHours())

    this.todaysDateAsNumber = todaysDateAsNumber

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

          this.searchForOutdatedGames();

          if (this.sortGamesByDatesArray[i].length == 0) {
            document.querySelectorAll('.dateIndicator' + i).forEach(el => el.remove())
            document.querySelectorAll('.currentGamesContainer' + i).forEach(el => el.remove())
          }

        }
      }
    }, 1000)

  }

  searchForOutdatedGames() {

            // ------ create a long number by concatenating the date
        // ------ to compare it to current date
        // ------ if smaller remove the game because it has already started or it's finished
        let longNumArray = []
        for (let i = 0; i < this.allGames.length; i++) {
           let num = Number(this.allGames[i].matchDateTime.slice(0, -9).replace("-", "").replace("-", "") + this.allGames[i].matchDateTime.slice(11, -6))
           let obj = {};
           Object.assign(obj, {
            date: this.allGames[i].matchDateTime,
            gameId: this.allGames[i].id,
            longNumber: num
           })
           longNumArray.push(obj)
        }

        longNumArray.forEach((el, i) => {

          if (this.todaysDateAsNumber > el.longNumber) {
            document.querySelector('.singleGame')[el.gameId].remove()
          }
        })

  }

  initiatePage() {

    this.saveDataToSlipState([], [], [], [])

    this.allGamesService.fetchNotPredictedGames(this.userId).subscribe(
      (response) => {
        this.allGames = response
        console.log('allGames:', this.allGames)

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

    document.querySelector('.addToSlip' + gameId).removeAttribute('disabled')
    document.querySelector('.select1-' + gameId).removeAttribute('disabled')
    document.querySelector('.select2-' + gameId).removeAttribute('disabled')

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

    document.querySelectorAll(".modalContent" + gameId).forEach(el => el.remove());

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

    for (let i = 0; i < localPayloadToSubmit.length; i++) {
      this.gamesIdsOnSlip.push(localPayloadToSubmit[i].game_id)
      document.querySelector('.addToSlip' + localPayloadToSubmit[i].game_id).setAttribute('disabled', 'true')
      document.querySelector('.select1-' + localPayloadToSubmit[i].game_id).setAttribute('disabled', 'true')
      document.querySelector('.select2-' + localPayloadToSubmit[i].game_id).setAttribute('disabled', 'true')
    }

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

        this.tooltip2_status.forEach(el => el = null)

        let localStarIcon = document.querySelector('.star' + gameId)
        localStarIcon.classList.add('hideMe')
        // localStarIcon.classList.toggle('hideMe')

        let localBoosterUsed = document.querySelector('.boosterUsed' + gameId)
        localBoosterUsed.classList.remove('invisible')
      }
    }

    this.payloadReady = this.unsortedPayload.filter(el => el)
    this.gamesOnSlip = this.unsortedGames.filter(el => el)

      if (this.booster == 0)
        document.querySelectorAll('.starContainer').forEach(el => el.classList.add('hide'))

  }

  removeBooster(el, i) {


  let clickedPrediction = this.unsortedPayload.find(el => el == this.payloadReady[i])
  let gameId =  clickedPrediction.game_id
  let gameIndex = this.unsortedPayload.indexOf(clickedPrediction)

  let newStar = `
  <div _ngcontent-vyd-c48="" class="cursor-pointer mr-2 starContainer starContainer${gameIndex}" id="starContainer${gameIndex}"><svg _ngcontent-vyd-c48="" title="Use Booster" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="star star${gameIndex}"><path _ngcontent-vyd-c48="" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path></svg></div>
  `

  if (this.booster < 3 && this.booster >= 0) {

    if (this.unsortedPayload[gameIndex].boostScoreXTimes == 2) {
      this.unsortedPayload[gameIndex].boostScoreXTimes = 1
      this.booster += 1

        this.tooltip3_status.forEach(el => el = null)

        // let localStarIcon = document.querySelector('.star' + gameId)
        // localStarIcon.classList.remove('hideMe')

        // document.querySelector('.starGroup' + gameId).innerHTML += (newStar)

        document.querySelector('.starGroup' + gameId).insertAdjacentHTML('afterbegin', newStar)
        document.querySelectorAll('.starContainer' + gameId).forEach((element, i) => {
          document.querySelectorAll('.starContainer' + gameId)[0].remove()
        });

        let localTimeTwoIcon = document.querySelector('.boosterUsed' + gameId)
        localTimeTwoIcon.classList.add('invisible')
      }
    }

    this.payloadReady = this.unsortedPayload.filter(el => el)
    this.gamesOnSlip = this.unsortedGames.filter(el => el)

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
      setTimeout(() => {
        this.warningMessage = ""
      }, 2000);
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
            setTimeout(() => {
              this.successMessage = ""
            }, 2000);

            this.saveDataToSlipState([], [], [], [])

            this.initiatePage();

          }
        })
      },

      (error) => {
        this.errorMessage = "Error while submitting predictions.\n It is highly likely that your access token has expired. Please logout and login again. Try submitting your predictions again."
        console.log("Error while submitting predictions", error);
        setTimeout(() => {
          this.errorMessage = ""
        }, 4000);
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
