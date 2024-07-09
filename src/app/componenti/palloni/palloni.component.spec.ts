import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PalloniComponent } from './palloni.component';

describe('PalloniComponent', () => {
  let component: PalloniComponent;
  let fixture: ComponentFixture<PalloniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PalloniComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PalloniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
