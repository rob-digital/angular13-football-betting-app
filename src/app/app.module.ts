import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TablesComponent } from './components/tables/tables.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
import { JwtInterceptorService } from './services/jwt-interceptor.service';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { PredictionComponent } from './components/prediction/prediction.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminComponent } from './components/admin/admin.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UserPredictionsComponent } from './components/user-predictions/user-predictions.component';
import { AdminGamesPlayedComponent } from './components/admin-games-played/admin-games-played.component';
import { AdminAllGamesComponent } from './components/admin-all-games/admin-all-games.component';
import { SuccessMessageComponent } from './components/success-message/success-message.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CreditsComponent } from './components/credits/credits.component';
import { AllTeamsComponent } from './components/all-teams/all-teams.component';
// import { authInterceptorProviders } from './interceptors/auth.interceptor';
@NgModule({
  declarations: [
    AppComponent,
    TablesComponent,
    LoginComponent,
    SpinnerComponent,
    PredictionComponent,
    RegisterComponent,
    AdminComponent,
    UserDetailsComponent,
    UserPredictionsComponent,
    AdminGamesPlayedComponent,
    AdminAllGamesComponent,
    SuccessMessageComponent,
    LeaderboardComponent,
    NotFoundComponent,
    CreditsComponent,
    AllTeamsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: JwtInterceptorService,
    //   multi: true
    // }
    // authInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
