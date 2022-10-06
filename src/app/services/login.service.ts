import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { LoginViewModel } from '../classes/login-view-model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  urlPrefix: string =  environment.BASE_URL;

  private httpClient: HttpClient | null = null
  constructor(private httpBackend: HttpBackend)  // JwtInterceptor will be not used here
  { }

  currentUserName: any = null;

  // public Login(loginViewModel: LoginViewModel): Observable<any>
  // {
  //   console.log('loginViewModel:', loginViewModel)
  //   this.httpClient = new HttpClient(this.httpBackend)  // httpClient represents the actual HttpClient without having any interceptors
  //   return this.httpClient.post<any>( this.urlPrefix + "/api/v1/authentication/sign-in", loginViewModel, { responseType: "json" })
  //           .pipe(map(user => {
  //             if (user)
  //             {
  //               console.log('user:', user)
  //               this.currentUserName = user.username
  //               console.log('this.currentUserName:', this.currentUserName)
  //               localStorage['currentUser'] = JSON.stringify(user)
  //             }
  //             return user;
  //           }))
  // }

  // public Logout()
  // {
  //   localStorage.removeItem("currentUser")
  //   this.currentUserName = null
  // }
}
