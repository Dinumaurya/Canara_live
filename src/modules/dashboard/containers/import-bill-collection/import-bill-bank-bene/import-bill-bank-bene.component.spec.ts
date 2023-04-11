import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportBillBankBeneComponent } from './import-bill-bank-bene.component';

describe('ImportBillBankBeneComponent', () => {
  let component: ImportBillBankBeneComponent;
  let fixture: ComponentFixture<ImportBillBankBeneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportBillBankBeneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportBillBankBeneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
