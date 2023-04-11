import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportApplicantComponent } from './export-applicant.component';

describe('ExportApplicantComponent', () => {
  let component: ExportApplicantComponent;
  let fixture: ComponentFixture<ExportApplicantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportApplicantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportApplicantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
