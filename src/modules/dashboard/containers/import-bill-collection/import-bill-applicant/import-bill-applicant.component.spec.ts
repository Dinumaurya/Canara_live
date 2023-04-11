import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportBillApplicantComponent } from './import-bill-applicant.component';

describe('ImportBillApplicantComponent', () => {
  let component: ImportBillApplicantComponent;
  let fixture: ComponentFixture<ImportBillApplicantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportBillApplicantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportBillApplicantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
