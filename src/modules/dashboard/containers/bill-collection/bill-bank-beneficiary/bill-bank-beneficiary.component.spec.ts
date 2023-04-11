import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillBankBeneficiaryComponent } from './bill-bank-beneficiary.component';

describe('BillBankBeneficiaryComponent', () => {
  let component: BillBankBeneficiaryComponent;
  let fixture: ComponentFixture<BillBankBeneficiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillBankBeneficiaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillBankBeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
