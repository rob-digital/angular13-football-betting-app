import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PredictionPayload } from '../classes/prediction-payload';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StateSlipService {

  private slipPayloadEntries$ = new BehaviorSubject<PredictionPayload[]>([]);
  private slipUnsortedPayloadEntries$ = new BehaviorSubject<any[]>([]);
  private slipGamesEntries$ = new BehaviorSubject<any[]>([]);
  private slipUnsortedGamesEntries$ = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) { }

  // ------------ unsorted payload -------------------
  public addUnsortedPayloadToSlipState(item: any[]) {
    this.slipUnsortedPayloadEntries$.next(item)
  }

  public getUnsortedPayloadFromSlipState(): Observable<any[]> {
    return this.slipUnsortedPayloadEntries$;
  }

   // ------------ payload -------------------
  public addPayloadToSlipState(item: PredictionPayload[]) {
    this.slipPayloadEntries$.next(item)
  }

  public getPayloadFromSlipState(): Observable<PredictionPayload[]> {
    return this.slipPayloadEntries$;
  }

  // ----------Unsorted games ---------------
  public addUnsortedGamesToSlipState(games: any[]) {
    this.slipUnsortedGamesEntries$.next(games);
  }

  public getUnsortedGamesFromSlipState(): Observable<any[]> {
    return this.slipUnsortedGamesEntries$;
  }
  // ---------- games ---------------
  public addGamesToSlipState(games: any[]) {
    this.slipGamesEntries$.next(games);
  }

  public getGamesFromSlipState(): Observable<any[]> {
    return this.slipGamesEntries$;
  }
}
