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
  todaysDate: Date = null


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

    this.initiatePage();


    if (sessionStorage.getItem("currentUser") == null) {
      this.router.navigateByUrl('/login');
      return;
    }

    this.userId = JSON.parse(sessionStorage.getItem("currentUser")).id;
    this.booster = JSON.parse(sessionStorage.getItem("currentUser")).activeBoosters;
    console.log('this.booster00000:', this.booster)

    if (this.sortGamesByDatesArray)
    console.log('this.sortGamesByDatesArray11111:', this.sortGamesByDatesArray)


    setInterval(() => {

      // const JWT = JSON.parse(sessionStorage.getItem("currentUser")).accessToken
      // const jwtPayload = JSON.parse(window.atob(JWT.split('.')[1]))
      // console.log(jwtPayload.exp);
      var convertDateTime = function(num) { return ('00'+num).slice(-2) };
      var todaysDate;
      todaysDate = new Date();
      todaysDate = todaysDate.getUTCFullYear()         + '-' +
                    convertDateTime(todaysDate.getUTCMonth() + 1)  + '-' +
                    convertDateTime(todaysDate.getUTCDate())       + 'T' +
                    convertDateTime(todaysDate.getUTCHours() + 1)      + ':' +
                    convertDateTime(todaysDate.getUTCMinutes())    + ':' +
                    convertDateTime(todaysDate.getUTCSeconds());


      var currentTime;
      // currentTime = new Date();
      // currentTime = convertDateTime(currentTime.getUTCHours())      + ':' +
      //               convertDateTime(currentTime.getUTCMinutes())    + ':' +
      //               convertDateTime(currentTime.getUTCSeconds());

      this.todaysDate = todaysDate

      let todaysDate2 = "2022-11-21T13:04:00"
      // console.log("Date: ", todaysDate);


      if (this.sortGamesByDatesArray != null) {
        for (let i = 0; i < this.sortGamesByDatesArray.length; i++) {

          this.sortGamesByDatesArray[i].forEach((element, j) => {
            if (element.matchDateTime == todaysDate) {
              // console.log("HOOOOORAYYY!!!", element.matchDateTime);
              let gameStartsNow = this.allGames.find(el => el.matchDateTime == todaysDate)
              let indexInAllGames = this.allGames.indexOf(gameStartsNow);
              let indexInAllDatesArray = this.sortGamesByDatesArray[i].indexOf(gameStartsNow);

              // console.log('gameStartsNow:', gameStartsNow)
              // console.log('JJJJJJJ:', j)
              if (element.id == gameStartsNow.id) {
                // console.log("ELELELE"  ,element)
                this.sortGamesByDatesArray[i].splice(indexInAllDatesArray, 1)
                this.allGames.splice(indexInAllGames, 1)
                document.querySelectorAll('.singleGame' + gameStartsNow.id).forEach(el => el.remove())
                // this.initiatePage();
                this.saveDataToSlipState([], [], [], [])

                this.selectedOptionsTeam1 = []
                this.selectedOptionsTeam2 = []
                console.log('this.selectedOptionsTeam2:', this.selectedOptionsTeam2)


                  this.slipText = "One of the games from your slip has already started. Your slip was cleared. Please place your predictions again."
                  document.getElementById('saveModalButton').style.display = 'none';

                  this.initiatePage()

                if (this.gamesOnSlip) {
                console.log('gameStartsNow:', gameStartsNow)
                // this.gamesOnSlip.forEach(e => {
                //   if (e.id  == gameStartsNow.id)
                // })
                  let indexInGameOnSlip = this.gamesOnSlip.indexOf(gameStartsNow)
                  // if (this.gamesOnSlip[indexInGameOnSlip]) {
                    // this.gamesOnSlip.splice(indexInGameOnSlip, 1)
                    // console.log('this.gamesOnSlip:', this.gamesOnSlip)
                    // this.payloadReady.splice(indexInGameOnSlip, 1)
                    // console.log('this.payloadReady:', this.payloadReady)

                    let indexInStateOfUnsortedGames: number = 0


                    // let localUnsortedPayload = []
                    // let localPayloadToSubmit = []


                    // let localUnsortedGames = []
                    // let localGamesOnSlip = []

                    // this.stateOfSlip.getGamesFromSlipState().subscribe(
                    //   (response) => {
                    //     response != null ? localGamesOnSlip = response : localGamesOnSlip = []
                    //   },
                    //   () => {}
                    // )

                    // this.stateOfSlip.getPayloadFromSlipState().subscribe(
                    //   (response) => {
                    //     response != null ? localPayloadToSubmit = response : localPayloadToSubmit = []
                    //   },
                    //   () => {}
                    // )

                    // this.stateOfSlip.getUnsortedPayloadFromSlipState().subscribe(
                    //   (response) => {
                    //     response != null ? localUnsortedPayload = response : localUnsortedPayload = []
                    //   },
                    //   () => {}
                    // );

                    // this.stateOfSlip.getUnsortedGamesFromSlipState().subscribe(
                    //   (response) => {
                    //     response != null ? localUnsortedGames = response : localUnsortedGames = []
                    //   },
                    //   () => {}
                    // );

                    // console.log('localUnsortedPayload:', localUnsortedPayload)
                    // console.log('localPayloadToSubmit:', localPayloadToSubmit)
                    // console.log('localUnsortedGames:', localUnsortedGames)
                    // console.log('localGamesOnSlip:', localGamesOnSlip)
                    // console.log('gameStartsNow.id:', gameStartsNow.id)
                    // if (localUnsortedPayload) {

                    //   let gameInUnsortedArray = localUnsortedPayload.find(z => z.game_id == gameStartsNow.id)
                    //   indexInStateOfUnsortedGames = localUnsortedPayload.indexOf(gameInUnsortedArray)
                    // }

                    // localUnsortedGames.splice(indexInStateOfUnsortedGames, 1)

                    // localUnsortedPayload.splice(indexInStateOfUnsortedGames, 1)

                    // localGamesOnSlip.splice(indexInGameOnSlip, 1)

                    // localPayloadToSubmit.splice(indexInGameOnSlip, 1)





                  // console.log('this.stateOfSlip.getUnsortedGamesFromSlipState():', this.stateOfSlip.getUnsortedGamesFromSlipState())
                  // console.log('this.stateOfSlip.getPayloadFromSlipState():', this.stateOfSlip.getPayloadFromSlipState())
                  // console.log('localUnsortedPayload:', localUnsortedPayload)
                  // console.log('localPayloadToSubmit:', localPayloadToSubmit)


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
      // console.log('this.sortGamesByDatesArray22222:', this.sortGamesByDatesArray)
      // console.log('this.allGames--AFTER:', this.allGames)

      // let gameStartsNow = this.sortGamesByDatesArray[0].find(el => el.matchDateTime == todaysDate2)
      // console.log('gameStartsNow:', gameStartsNow)

      // console.log("Time: ", currentTime);

      // if (this.allGames != null) {

      //   this.allGames.forEach((el, i) => {
      //     if (el != null && el.matchDate == todaysDate2) {
      //       console.log(i);
      //       document.getElementsByClassName('gameTable')[i].remove()

      //     }
      //   })
      // }

    }, 1000)

    console.log('this.todaysDate:', this.todaysDate)


  }

  initiatePage() {
      this.saveDataToSlipState([], [], [], [])


    this.allGamesService.fetchNotPredictedGames(this.userId).subscribe(
      (response) => {
        this.allGames = response
        console.log('this.allGames:', this.allGames)
        // this.allGames.sort((a, b) => a.id - b.id)

        const uniqueDates = new Set(this.allGames.map(el => el.matchDateTime.slice(0, -9)))
        let allDatesArray = [...uniqueDates]

        this.allDatesArray = allDatesArray
        // this.allDatesArray.reverse()
        console.log('allDatesArray:', allDatesArray)
        // allDatesArray.forEach(el => console.log("NEW DATRE", el.toISOString().slice(0,10))
        // )

        let sortGamesByDatesArray = [];
        for(let i=0;i<allDatesArray.length;i++){
          sortGamesByDatesArray.push(this.allGames.filter((el, j) =>el.matchDateTime.slice(0, -9) == allDatesArray[i]));
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








  deleteFromSlip(e ,i) {



    console.log('this.unsortedPayload0000:', this.unsortedPayload)
    console.log('this.unsortedGames-0000:', this.unsortedGames)

    let clickedPrediction = this.unsortedPayload.find(el => el == this.payloadReady[i])
    let gameIndex = this.unsortedPayload.indexOf(clickedPrediction)
    console.log('gameIndex:', gameIndex)
    let gameId = clickedPrediction.game_id
    console.log('gameId:', gameId)

    this.selectedOptionsTeam1[gameId-1] = null
    this.selectedOptionsTeam2[gameId-1] = null


    if (this.booster < 3 && this.booster >= 0) {

      if (this.unsortedPayload[gameIndex].boostScoreXTimes == 2) {
        this.unsortedPayload[gameIndex].boostScoreXTimes = 1
        this.booster += 1
        // let localStarIcon = document.querySelector('.starContainer'+gameId)
        // localStarIcon.classList.remove('hide')

        // let localTimeTwoIcon = document.querySelector('.timesTwo' + gameId)
        // localTimeTwoIcon.classList.add('invisible')
        // console.log('localStarIcon:', localStarIcon)


      }


    }

    // this.unsortedPayload.splice(gameIndex, 1)
    // this.unsortedGames.splice(gameIndex, 1)
    this.unsortedPayload[gameIndex] = null
    this.unsortedGames[gameIndex] = null
    console.log('this.unsortedPayload0000:', this.unsortedPayload)
    console.log('this.unsortedGames-0000:', this.unsortedGames)

    this.payloadReady = this.unsortedPayload.filter(el => el)
    this.gamesOnSlip = this.unsortedGames.filter(el => el)

    console.log('this.payloadReady4444:', this.payloadReady)
    console.log(' this.gamesOnSlip4444:',  this.gamesOnSlip)


    if (this.booster == 0)
      document.querySelectorAll('.starContainer').forEach(el => el.classList.add('hide'))


    document.querySelectorAll(".modalContent"+gameId).forEach(el => el.remove());



    console.log('this.payloadReady % %%%:', this.payloadReady)
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




    // console.log('this.payloadReadyXXX:', this.payloadReady)
    // console.log('this.GAMES_XXX:', this.gamesToSubmit)
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

    // if (this.booster == 0)  {

    //   document.querySelectorAll('.starContainer').forEach(element => {
    //     element.classList.add('hide');
    //   });
    // }


    // console.log("$$$$$$$$", this.copyOfCurrentPredictionArrayWithGames);


  }

  calculateBooster(el, i) {


  // localGamesOnSlip = this.gamesOnSlip
  // console.log('localGamesOnSlip:', localGamesOnSlip)
  // localUnsortedGames = this.unsortedGames
  // console.log('localUnsortedGames:', localUnsortedGames)
  // localPayloadToSubmit = this.payloadReady
  // console.log('localPayloadToSubmit:', localPayloadToSubmit)
  // localUnsortedPayload = this.unsortedPayload
  // console.log('localUnsortedPayload:', localUnsortedPayload)

  //   let elementInPayloadReadyArray = this.payloadReady.find(el => el == this.gamesToSubmit[i])
  //   console.log('elementInPayloadReadyArray:', elementInPayloadReadyArray)

  //  let indexInPayloadReadyArray = this.payloadReady.indexOf(elementInPayloadReadyArray)
  //   console.log('indexInPayloadReadyArray:', indexInPayloadReadyArray)
  //   console.log('iQQQ:', i)
  // let clickedMatch = this.gamesOnSlip.find(el => el == this.gamesOnSlip[i])
  // let indexInPrepareGamesToSlip = this.unsortedGames.indexOf(clickedMatch)

  let clickedPrediction = this.unsortedPayload.find(el => el == this.payloadReady[i])
  let gameId =  clickedPrediction.game_id
  console.log('gameId:', gameId)
  let gameIndex = this.unsortedPayload.indexOf(clickedPrediction)
  console.log('gameIndex--CalcBooster:', gameIndex)

    if (this.booster > 0 && this.booster <= 3) {

      console.log('this.unsortedPayload[gameIndex]:', this.unsortedPayload[gameIndex])
      if (this.unsortedPayload[gameIndex].boostScoreXTimes == 1) {
        this.unsortedPayload[gameIndex].boostScoreXTimes = 2
        this.booster -= 1
  console.log('this.preparePayload:', this.unsortedPayload)

        let localStarIcon = document.querySelector('.starContainer' + gameId)
        localStarIcon.classList.add('hide')

        let localTimeTwoIcon = document.querySelector('.timesTwo' + gameId)
        localTimeTwoIcon.classList.remove('invisible')
        console.log('localStarIcon:', localStarIcon)
      }
    }

    this.payloadReady = this.unsortedPayload.filter(el => el)
    this.gamesOnSlip = this.unsortedGames.filter(el => el)

    // this.saveDataToSlipState(localUnsortedPayload, localUnsortedGames, localPayloadToSubmit, localGamesOnSlip)



      if (this.booster == 0)
        document.querySelectorAll('.starContainer').forEach(el => el.classList.add('hide'))

      console.log('this.booster:', this.booster)
      if (this.booster == 0) console.log("ZERO");

    // console.log('payloadReady111:', this.payloadReady)


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
                        console.log('responseDDDDDDDDDD:', response)
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

                    console.log('localUnsortedGames--000000000000000:', localUnsortedGames)


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
    console.log('chosenGame:', chosenGame)
    localUnsortedGames[gameId] = chosenGame
    console.log('localUnsortedGamesVVVVVVVVVV:', localUnsortedGames)

    let gamesToDisplayOnSlip = localUnsortedGames.filter(el => el)

    localUnsortedPayload[gameId] = singlePredictionPayload
    let payloadToSubmit = localUnsortedPayload.filter(el => el)
    console.log('payloadToSubmit:', payloadToSubmit)


    this.saveDataToSlipState(localUnsortedPayload, localUnsortedGames, payloadToSubmit, gamesToDisplayOnSlip)

    this.stateOfSlip.getGamesFromSlipState().subscribe(
      (response) => {
        this.gamesOnSlipLength = response.length
        console.log('this.gamesOnSlipLength:', this.gamesOnSlipLength)
      }
    );



    // this.stateOfSlip.getUnsortedGamesFromSlipState().subscribe(
    //   (response) => {
    //     console.log("UNsorted GAMES", response);

    //   }
    // );

    // this.stateOfSlip.getUnsortedPayloadFromSlipState().subscribe(
    //   (response) => {
    //     console.log("UNsorted Payload", response);

    //   }
    // );

    // this.stateOfSlip.getPayloadFromSlipState().subscribe(
    //   (response) => {
    //     console.log("PAYLOAD", response);

    //   }
    // );




  }

  onClickSave() {

    this.inTransit = true;


    this.predictionService.submitPredictions(this.payloadReady).subscribe(
      (res) => {

        fetch(location.href).then(response => {
          console.log(response.status)

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
            // document.getElementById('predictionModal').setAttribute('data-bs-dismiss', 'modal')
            // document.querySelector('.modal-backdrop').setAttribute('data-bs-dismiss', 'modal')
            // this.copyOfCurrentPredictionArrayWithGames = []
            // this.payloadReady = []

            this.saveDataToSlipState([], [], [], [])

            // document.getElementsByClassName('gameTable')[this.actualGameIndex].remove();

            // this.payloadReady.length == 0
            //   ? this.slipText = "Your slip is empty"
            //   : this.slipText = "You're about to submit the following games: ";

            //   this.allGames.length == 0
            //   ? this.thanks = "Nothing to submit, thanks for taking part :)"
            //   : null
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

  // getDataFromSlipState() {


  //   let localGamesOnSlip = []
  //   let localPayloadToSubmit = []
  //   let localUnsortedPayload = []
  //   let localUnsortedGames = []

  //   this.stateOfSlip.getGamesFromSlipState().subscribe(
  //     (response) => {
  //       localGamesOnSlip = response
  //     },
  //     () => {}
  //   )

  //   this.stateOfSlip.getPayloadFromSlipState().subscribe(
  //     (response) => {
  //       localPayloadToSubmit = response
  //     },
  //     () => {}
  //   )

  //   this.stateOfSlip.getUnsortedPayloadFromSlipState().subscribe(
  //     (response) => {
  //       response != null ? localUnsortedPayload = response : localUnsortedPayload = []
  //     },
  //     () => {}
  //   );

  //   this.stateOfSlip.getUnsortedGamesFromSlipState().subscribe(
  //     (response) => {
  //       response != null ? localUnsortedGames = response : localUnsortedGames = []
  //     },
  //     () => {}
  //   );

  //   return {
  //     localGamesOnSlip,
  //     localPayloadToSubmit,
  //     localUnsortedPayload,
  //     localUnsortedGames
  //   }
  // }


  saveDataToSlipState(localUnsortedPayload, localUnsortedGames,  localPayloadToSubmit, localGamesOnSlip ) {

    this.stateOfSlip.addUnsortedPayloadToSlipState(localUnsortedPayload);
    this.stateOfSlip.addUnsortedGamesToSlipState(localUnsortedGames);

    this.stateOfSlip.addPayloadToSlipState(localPayloadToSubmit);
    this.stateOfSlip.addGamesToSlipState(localGamesOnSlip);
  }

  ngOnDestroy() {
    // if (this .subscription != null) {
    //   this.subscription.unsubscribe();
    // }
    this.saveDataToSlipState([], [], [], [])

  }

  closeModalTest() {
    document
  }

}
