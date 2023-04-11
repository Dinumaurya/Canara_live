import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcBeneficiaryDetailComponent } from './lc-beneficiary-detail.component';

describe('LcBeneficiaryDetailComponent', () => {
  let component: LcBeneficiaryDetailComponent;
  let fixture: ComponentFixture<LcBeneficiaryDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LcBeneficiaryDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LcBeneficiaryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
