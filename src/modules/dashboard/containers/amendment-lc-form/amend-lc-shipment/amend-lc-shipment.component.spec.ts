import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmendLcShipmentComponent } from './amend-lc-shipment.component';

describe('AmendLcShipmentComponent', () => {
  let component: AmendLcShipmentComponent;
  let fixture: ComponentFixture<AmendLcShipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmendLcShipmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmendLcShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
