import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagamento-ok',
  templateUrl: './pagamento-ok.component.html',
  styleUrl: './pagamento-ok.component.css',
})
export class PagamentoOKComponent {
  constructor(private router: Router) {}

  tornaAllaHome(): void {
    //Torna alla home
    this.router.navigate(['/home']);
  }
}
