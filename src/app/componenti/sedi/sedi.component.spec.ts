import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SediComponent } from './sedi.component';

describe('SediComponent', () => {
  let component: SediComponent;
  let fixture: ComponentFixture<SediComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SediComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SediComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
