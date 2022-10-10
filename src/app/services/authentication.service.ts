import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../classes/user-model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

const API_URL: string = environment.BASE_URL + '/api/v1/authentication';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public currentUser: Observable<User>;
  private currentUserSubject: BehaviorSubject<User>;
  currentUsername: any = null;
  loginInTransit: boolean = false;


  constructor(private http: HttpClient, public router: Router) {
    let storageUser;
    const storageUserAsStr = sessionStorage.getItem('currentUser');
    if (storageUserAsStr) {
      storageUser = JSON.parse(storageUserAsStr);
    }

    this.currentUserSubject = new BehaviorSubject<User>(storageUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(user: User): Observable<any> {
    return this.http.post<User>(API_URL + '/sign-in', user).pipe(
      map(response => {
        if (response) {
          console.log('response:', response)
          this.router.navigate(['/predict']);
          //set session-user
          this.setSessionUser(response);
        }
        // else {
        //   this.loginInTransit = true
        // }

        return response;
        })
    );
  }

  setSessionUser(user: User) {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.currentUsername = user.name;
    console.log('this.currentUsername:', this.currentUsername)
  }

  register(user: User): Observable<any> {
    return this.http.post(API_URL + '/sign-up', user);
  }

  logout() {
    this.currentUsername = null
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject.next(new User);
  }

  refreshToken(): Observable<any> {
    return this.http.post(API_URL + '/refresh-token?token=' + this.currentUserValue?.refreshToken, {});
  }

}


