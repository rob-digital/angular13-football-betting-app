import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { PredictionPayload } from '../classes/prediction-payload';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {

  urlPrefix: string = environment.BASE_URL;

  constructor(private http: HttpClient, public router: Router) {

  }

  submitPredictions(payload: PredictionPayload) {

    return this.http.post<PredictionPayload[]>
          (this.urlPrefix + "/api/v1/predictions/insert",
          payload,
          { responseType: "json" });
  }

}
