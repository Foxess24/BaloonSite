import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagamentoOKComponent } from './pagamento-ok.component';

describe('PagamentoOKComponent', () => {
  let component: PagamentoOKComponent;
  let fixture: ComponentFixture<PagamentoOKComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PagamentoOKComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PagamentoOKComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
