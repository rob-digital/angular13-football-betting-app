import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TablesComponent } from './components/tables/tables.component';
import { LoginComponent } from './components/login/login.component';
import { BetComponent } from './components/bet/bet.component';
import { FormsModule } from '@angular/forms';
import { JwtInterceptorService } from './services/jwt-interceptor.service';
import { FutureGamesComponent } from './components/future-games/future-games.component'
@NgModule({
  declarations: [
    AppComponent,
    TablesComponent,
    LoginComponent,
    BetComponent,
    FutureGamesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
