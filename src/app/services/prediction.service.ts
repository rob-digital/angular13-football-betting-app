import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PredictionPayload } from '../classes/prediction-payload';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { RequestBaseService } from './request-base.service';
import { User } from '../classes/user-model';

@Injectable({
  providedIn: 'root'
})

export class PredictionService extends RequestBaseService{


  urlPrefix: string = environment.BASE_URL;

  constructor(authenticationService: AuthenticationService, http: HttpClient) {
    super(authenticationService, http);
  }

  submitPredictions(payload: PredictionPayload[]): Observable<PredictionPayload[]> {
    return this.http.post<PredictionPayload[]>(this.urlPrefix + "/api/v1/predictions/insert", payload, {headers: this.getHeaders});
  }

  fetchUserPredictions(userId: number): Observable<PredictionPayload[]> {
  console.log('userId::', userId)

    return this.http.get<PredictionPayload[]>(this.urlPrefix + "/api/v1/predictions/user/" + userId, { responseType: "json" });

  }


}

