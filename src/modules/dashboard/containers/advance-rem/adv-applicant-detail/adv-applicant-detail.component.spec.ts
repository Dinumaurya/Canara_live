import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvApplicantDetailComponent } from './adv-applicant-detail.component';

describe('AdvApplicantDetailComponent', () => {
  let component: AdvApplicantDetailComponent;
  let fixture: ComponentFixture<AdvApplicantDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvApplicantDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvApplicantDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
