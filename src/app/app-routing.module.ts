import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TablesComponent } from './tables/tables.component';
import { BetComponent } from './bet/bet.component';

const routes: Routes = [
  // { path: "", redirectTo: "login", pathMatch: "full"},
  { path: "login", component: LoginComponent},
  { path: "bet", component: BetComponent},
  { path: "tables", component: TablesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],  // check if useHsh can be deleted
  exports: [RouterModule]
})
export class AppRoutingModule {


}
