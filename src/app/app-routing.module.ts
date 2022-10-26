import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TablesComponent } from './components/tables/tables.component';
import { PredictionComponent } from './components/prediction/prediction.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { Role } from './classes/role-enum';
import { AdminComponent } from './components/admin/admin.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UserPredictionsComponent } from './components/user-predictions/user-predictions.component';
import { AdminAllGamesComponent } from './components/admin-all-games/admin-all-games.component';
import { AdminGamesPlayedComponent } from './components/admin-games-played/admin-games-played.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CreditsComponent } from './components/credits/credits.component';

const routes: Routes = [

  { path: "", redirectTo: "login", pathMatch: "full"},
  { path: "login", component: LoginComponent},
  { path: "register", component: RegisterComponent},
  { path: "404", component: NotFoundComponent},
  { path: "credits", component: CreditsComponent},
  { path: "predict",
    component: PredictionComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.ADMIN, Role.USER]}
  },
  { path: "tables",
      component: TablesComponent,
      canActivate: [AuthGuard],
      data: { roles: [Role.ADMIN, Role.USER]}

  },
  { path: "leaderboard/list",
      component: LeaderboardComponent,
      canActivate: [AuthGuard],
      data: { roles: [Role.ADMIN, Role.USER]}

  },
  { path: "admin/allusers",
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.ADMIN]}
  },
  { path: "admin/noscore",
    component: AdminAllGamesComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.ADMIN]}
  },
  { path: "admin/allgamesplayed",
    component: AdminGamesPlayedComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.ADMIN]}
  },

  { path: 'details/:id',
    component: UserDetailsComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.ADMIN]}
  }, //detail/1
  { path: 'predictions/user/:id',
    component: UserPredictionsComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.ADMIN, Role.USER]}
  }, //detail/1
  // { path: "admin", component: TablesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],  // check if useHsh can be deleted
  exports: [RouterModule]
})
export class AppRoutingModule {

  constructor(private router: Router) {
    this.router.errorHandler = (error: any) => {
      this.router.navigate(['404']);
    }
  }

}
