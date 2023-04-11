import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportBillShipmentComponent } from './import-bill-shipment.component';

describe('ImportBillShipmentComponent', () => {
  let component: ImportBillShipmentComponent;
  let fixture: ComponentFixture<ImportBillShipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportBillShipmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportBillShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
