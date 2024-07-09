import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagamento-no',
  templateUrl: './pagamento-no.component.html',
  styleUrl: './pagamento-no.component.css',
})
export class PagamentoNoComponent {
  constructor(private router: Router) {}

  tornaAlCarrello(): void {
    //Torna al carrello
    this.router.navigate(['/carrello']);
  }
}
