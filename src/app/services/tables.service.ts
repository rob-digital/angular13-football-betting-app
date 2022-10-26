import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Team } from '../classes/team';
import { Flag } from '../classes/flag';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TablesService {

  urlPrefix: string = environment.BASE_URL;

  constructor(private httpClient: HttpClient) { }

  getAllTeams(): Observable<Team[]>
  {
    return this.httpClient.get<Team[]>(this.urlPrefix + "/api/v1/teams/all", { responseType: "json" });
  }
}
