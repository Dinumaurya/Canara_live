import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillShipmentComponent } from './bill-shipment.component';

describe('BillShipmentComponent', () => {
  let component: BillShipmentComponent;
  let fixture: ComponentFixture<BillShipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillShipmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
