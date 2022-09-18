import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Team } from '../classes/team';
import { Flag } from '../classes/flag';
@Injectable({
  providedIn: 'root'
})
export class TablesService {

  constructor(private httpClient: HttpClient) { }

  getAllTeams(): Observable<Team[]>
  {
    // let currentUser = {token: ""}
    // let headers = new HttpHeaders()
    // headers = headers.set("Authorization", "Bearer ")

    // if (sessionStorage["currentUser"] != null)
    // {
    //   currentUser = JSON.parse(sessionStorage["currentUser"])
    //   headers = headers.set("Authorization", "Bearer " + currentUser.token)
    // }

    return this.httpClient.get<Team[]>("http://localhost:7070/api/v1/teams/all", { responseType: "json" });
  }

  // getCountryFlags(): Observable<string>
  // {
  //   return this.httpClient.get<string>("https://countryflagsapi.com/svg/");
  // }

  // getCountryFlagsFromJson(): Observable<Flag[]>
  // {
  //   return this.httpClient.get<Flag[]>("assets/flags.json", { responseType: "json" })
  // }
}
