import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './componenti/header/header.component';
import { FooterComponent } from './componenti/footer/footer.component';
import { HomeComponent } from './componenti/home/home.component';
import { PalloniComponent } from './componenti/palloni/palloni.component';
import { CarrelloComponent } from './componenti/carrello/carrello.component';
import { ContattiComponent } from './componenti/contatti/contatti.component';
import { SediComponent } from './componenti/sedi/sedi.component';
import { LoginComponent } from './componenti/login/login.component';
import { SignupComponent } from './componenti/signup/signup.component';
import { AdminComponent } from './componenti/admin/admin.component';
import { environment } from '../environments/environment';
import { ProfiloComponent } from './componenti/profilo/profilo.component';
import { AuthService } from './auth/auth.service';
import { ForgotPwComponent } from './componenti/forgot-pw/forgot-pw.component';
import { DettagliProdottoComponent } from './componenti/dettagli-prodotto/dettagli-prodotto.component';
import { PagamentoOKComponent } from './componenti/pagamento-ok/pagamento-ok.component';
import { PagamentoNoComponent } from './componenti/pagamento-no/pagamento-no.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    PalloniComponent,
    CarrelloComponent,
    ContattiComponent,
    SediComponent,
    LoginComponent,
    SignupComponent,
    AdminComponent,
    ProfiloComponent,
    ForgotPwComponent,
    DettagliProdottoComponent,
    PagamentoOKComponent,
    PagamentoNoComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
  ],
  providers: [AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
