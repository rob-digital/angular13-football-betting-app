export class PredictionPayload {

  game_id: number;
  user_id: number;
  prediction1 : number;
  prediction2 : number;
  boostScoreXTimes: number;

  constructor()
  {
      this.game_id = 0;
      this.user_id = 0;
      this.prediction1 = 0
      this.prediction2 = 0;
      this.boostScoreXTimes = 1;
  }

}
