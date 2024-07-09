import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagamentoNoComponent } from './pagamento-no.component';

describe('PagamentoNoComponent', () => {
  let component: PagamentoNoComponent;
  let fixture: ComponentFixture<PagamentoNoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PagamentoNoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PagamentoNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
