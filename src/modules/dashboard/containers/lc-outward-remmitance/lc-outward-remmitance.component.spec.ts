import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcOutwardRemmitanceComponent } from './lc-outward-remmitance.component';

describe('LcOutwardRemmitanceComponent', () => {
  let component: LcOutwardRemmitanceComponent;
  let fixture: ComponentFixture<LcOutwardRemmitanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LcOutwardRemmitanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LcOutwardRemmitanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
