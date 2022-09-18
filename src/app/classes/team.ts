export class Team {

  id: number;
  name: string;
  odds: number;
  win: number;
  draw: number;
  loss: number;
  goalsScored: number;
  goalsLost: number;
  points: number;
  groupName: string;
  countryCode: string;
  positionInTable: number;

  constructor() {
    this.id = 0;
    this.name = "";
    this.odds = 0;
    this.win = 0;
    this.draw = 0;
    this.loss = 0;
    this.goalsScored = 0;
    this.goalsLost = 0;
    this.points = 0;
    this.groupName = "";
    this.countryCode = "";
    this.positionInTable = 0;
  }

}
