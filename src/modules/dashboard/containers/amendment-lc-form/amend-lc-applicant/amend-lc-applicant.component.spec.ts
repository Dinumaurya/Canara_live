import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmendLcApplicantComponent } from './amend-lc-applicant.component';

describe('AmendLcApplicantComponent', () => {
  let component: AmendLcApplicantComponent;
  let fixture: ComponentFixture<AmendLcApplicantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmendLcApplicantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmendLcApplicantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
