import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcApplicantDetailComponent } from './lc-applicant-detail.component';

describe('LcApplicantDetailComponent', () => {
  let component: LcApplicantDetailComponent;
  let fixture: ComponentFixture<LcApplicantDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LcApplicantDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LcApplicantDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
