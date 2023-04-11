import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportBankBeneficiaryComponent } from './export-bank-beneficiary.component';

describe('ExportBankBeneficiaryComponent', () => {
  let component: ExportBankBeneficiaryComponent;
  let fixture: ComponentFixture<ExportBankBeneficiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportBankBeneficiaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportBankBeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
