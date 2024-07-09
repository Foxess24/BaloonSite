import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettagliProdottoComponent } from './dettagli-prodotto.component';

describe('DettagliProdottoComponent', () => {
  let component: DettagliProdottoComponent;
  let fixture: ComponentFixture<DettagliProdottoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DettagliProdottoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DettagliProdottoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
