import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LCInlandComponent } from './lc-inland.component';

describe('LCInlandComponent', () => {
  let component: LCInlandComponent;
  let fixture: ComponentFixture<LCInlandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LCInlandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LCInlandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
