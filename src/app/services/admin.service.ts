import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {RequestBaseService} from "./request-base.service";
import {AuthenticationService} from "./authentication.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { ScorePayload } from '../classes/score-payload';
import { GameIdPayload } from '../classes/game-id-payload';

const API_URL = environment.BASE_URL + "/api/v1/admin";
const API_GAMES_URL = environment.BASE_URL + "/api/v1/games";

@Injectable({
  providedIn: 'root'
})
export class AdminService extends RequestBaseService{

  constructor(authenticationService: AuthenticationService, http: HttpClient) {
    super(authenticationService, http);
  }

  findAllUsers(): Observable<any> {
    return this.http.get(API_URL + '/allusers', {headers: this.getHeaders});
  }

  findPlayedGames(): Observable<any> {
    return this.http.get(API_URL + '/allgamesplayed', {headers: this.getHeaders})
  }

  findGamesWithoutScore(): Observable<any> {
    return this.http.get(API_URL + '/noscore', {headers: this.getHeaders})
  }

  submitGameScore(id: number, payload: ScorePayload): Observable<ScorePayload> {
    return this.http.put<ScorePayload>(API_GAMES_URL + "/insert/" + id, payload, {headers: this.getHeaders});
  }

  calculatePointsForGame(gameId: number, payload: GameIdPayload):Observable<GameIdPayload> {
    return this.http.put<GameIdPayload>(API_URL + "/calculate/game/" + gameId, payload, {headers: this.getHeaders});
  }
}
