import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TablesComponent } from './tables/tables.component';
import { FutureGamesComponent } from './components/future-games/future-games.component';
import { PredictionComponent } from './components/prediction/prediction.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { Role } from './classes/role-enum';
import { AdminComponent } from './components/admin/admin.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UserPredictionsComponent } from './components/user-predictions/user-predictions.component';
import { AdminAllGamesComponent } from './components/admin-all-games/admin-all-games.component';
import { AdminGamesPlayedComponent } from './components/admin-games-played/admin-games-played.component';

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full"},
  { path: "login", component: LoginComponent},
  { path: "register", component: RegisterComponent},
  { path: "predict",
    component: PredictionComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.ADMIN, Role.USER]}
  },
  { path: "future-games",
    component: FutureGamesComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.ADMIN, Role.USER]}

  },
  { path: "tables",
      component: TablesComponent,
      canActivate: [AuthGuard],
      data: { roles: [Role.ADMIN, Role.USER]}

  },
  { path: "admindata/allusers",
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.ADMIN]}
  },
  { path: "admindata/noscore",
    component: AdminAllGamesComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.ADMIN]}
  },
  { path: "admindata/allgamesplayed",
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


}
