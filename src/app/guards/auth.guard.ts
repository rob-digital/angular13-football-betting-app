import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../classes/user-model';
import { AuthenticationService } from '../services/authentication.service';
// import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private currentUser: User = new User();

  constructor(private authenticationService: AuthenticationService, private router: Router) {
    this.authenticationService.currentUser.subscribe(data => {
      this.currentUser = data;
    });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.currentUser) {
      if (route.data.roles?.indexOf(this.currentUser.role) === -1) {
        this.router.navigate(['/login']);
        return false;
      }

      return true;
    }

    this.router.navigate(['/login']);

    return true;
  }

}

// @Injectable({
//   providedIn: 'root'
// })
// export class CanActivateGuardService implements CanActivate {

//   constructor(private loginService: LoginService, private router: Router, private jwtHelperService: JwtHelperService) { }

//   canActivate(route: ActivatedRouteSnapshot): boolean
//   {
//     let token = sessionStorage.getItem("currentUser")
//                   ? JSON.parse(sessionStorage.getItem("currentUser")).token
//                   : null

//     // user must be logged in meaning a valid token must exist in session storage
//     // and
//     // role must be "admin" in the payload of the jwt token
//     if (this.loginService.isAuthenticated() && this.jwtHelperService.decodeToken(token).role ==
//                                                 route.data["expectedRole"]) {
//       console.log("User is trying to access: ", this.router.url);

//       return true
//     } else {
//       this.router.navigate(["login"])
//       return false
//     }
//   }


// }
