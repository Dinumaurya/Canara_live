import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillApplicantComponent } from './bill-applicant.component';

describe('BillApplicantComponent', () => {
  let component: BillApplicantComponent;
  let fixture: ComponentFixture<BillApplicantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillApplicantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillApplicantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
