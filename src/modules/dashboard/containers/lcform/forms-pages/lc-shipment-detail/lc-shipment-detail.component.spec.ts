import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcShipmentDetailComponent } from './lc-shipment-detail.component';

describe('LcShipmentDetailComponent', () => {
  let component: LcShipmentDetailComponent;
  let fixture: ComponentFixture<LcShipmentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LcShipmentDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LcShipmentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
