import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AllGamesService {

  urlPrefix: string = environment.BASE_URL;

  constructor(private httpClient: HttpClient ) { }

  getAllGames(userId: number): Observable<any[]> {

    return this.httpClient.get<any[]>(this.urlPrefix + "/api/v1/games/all/user/" + userId, { responseType: "json" });
  }
}
