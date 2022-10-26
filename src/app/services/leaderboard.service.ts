import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeaderboardUser } from '../classes/leaderboard-user';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {

  urlPrefix: string = environment.BASE_URL;

  constructor(private http: HttpClient) {}

   getUsersForLeaderboard(): Observable<LeaderboardUser[]> {
    return this.http.get<LeaderboardUser[]>(this.urlPrefix + "/api/v1/leaderboard/list", { responseType: "json" })
   }
}
