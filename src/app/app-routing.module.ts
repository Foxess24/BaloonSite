import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//COMPONENTI
import { HomeComponent } from './componenti/home/home.component';
import { PalloniComponent } from './componenti/palloni/palloni.component';
import { CarrelloComponent } from './componenti/carrello/carrello.component';
import { SediComponent } from './componenti/sedi/sedi.component';
import { ContattiComponent } from './componenti/contatti/contatti.component';
import { LoginComponent } from './componenti/login/login.component';
import { SignupComponent } from './componenti/signup/signup.component';
import { AdminComponent } from './componenti/admin/admin.component';
import { ProfiloComponent } from './componenti/profilo/profilo.component';
import { ForgotPwComponent } from './componenti/forgot-pw/forgot-pw.component';
import { DettagliProdottoComponent } from './componenti/dettagli-prodotto/dettagli-prodotto.component';
import { PagamentoOKComponent } from './componenti/pagamento-ok/pagamento-ok.component';
import { PagamentoNoComponent } from './componenti/pagamento-no/pagamento-no.component';
import { adminGuard } from './auth/admin.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'palloni', component: PalloniComponent },
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },

  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'profilo', component: ProfiloComponent },

  { path: 'sedi', component: SediComponent },
  { path: 'contatti', component: ContattiComponent },

  { path: 'recupero-password', component: ForgotPwComponent },

  { path: 'carrello', component: CarrelloComponent },
  { path: 'dettagli-pallone/:id', component: DettagliProdottoComponent },

  { path: 'pagamentoEffettuatoConSuccesso', component: PagamentoOKComponent },
  { path: 'pagamentoRifiutato', component: PagamentoNoComponent },

  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
