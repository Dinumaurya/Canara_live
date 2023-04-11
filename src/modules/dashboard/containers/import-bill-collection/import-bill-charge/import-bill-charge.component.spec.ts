import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportBillChargeComponent } from './import-bill-charge.component';

describe('ImportBillChargeComponent', () => {
  let component: ImportBillChargeComponent;
  let fixture: ComponentFixture<ImportBillChargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportBillChargeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportBillChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
