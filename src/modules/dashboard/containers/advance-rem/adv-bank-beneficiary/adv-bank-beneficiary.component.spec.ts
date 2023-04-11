import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvBankBeneficiaryComponent } from './adv-bank-beneficiary.component';

describe('AdvBankBeneficiaryComponent', () => {
  let component: AdvBankBeneficiaryComponent;
  let fixture: ComponentFixture<AdvBankBeneficiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvBankBeneficiaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvBankBeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
