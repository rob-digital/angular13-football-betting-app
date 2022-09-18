import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { LoginViewModel } from '../classes/login-view-model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private httpClient: HttpClient | null = null
  constructor(private httpBackend: HttpBackend)  // JwtInterceprot will be not used here
  { }

  currentUserName: any = null;

  public Login(loginViewModel: LoginViewModel): Observable<any>
  {
    this.httpClient = new HttpClient(this.httpBackend)  // httpClient represents the actual HttpClient without having any interceptors
    return this.httpClient.post<any>("/authenticate", loginViewModel, { responseType: "json" })
            .pipe(map(user => {
              if (user)
              {
                this.currentUserName = user.UserName
                localStorage['currentUser'] = JSON.stringify(user)
              }
              return user;
            }))
  }

  public Logout()
  {
    localStorage.removeItem("currentUser")
    this.currentUserName = null
  }
}
