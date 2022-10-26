import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { LoginViewModel } from '../classes/login-view-model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  urlPrefix: string =  environment.BASE_URL;

  private httpClient: HttpClient | null = null
  constructor(private httpBackend: HttpBackend, private authenticationService: AuthenticationService)  // JwtInterceptor will be not used here
  { }

  logoutUSer() {
    this.authenticationService.removeUserFromSession();
  }

   currentUserName: any = null;

}
