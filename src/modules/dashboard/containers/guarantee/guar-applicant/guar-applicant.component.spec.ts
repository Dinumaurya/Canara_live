import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuarApplicantComponent } from './guar-applicant.component';

describe('GuarApplicantComponent', () => {
  let component: GuarApplicantComponent;
  let fixture: ComponentFixture<GuarApplicantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuarApplicantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuarApplicantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
