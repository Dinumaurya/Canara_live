import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvShipmentDetailComponent } from './adv-shipment-detail.component';

describe('AdvShipmentDetailComponent', () => {
  let component: AdvShipmentDetailComponent;
  let fixture: ComponentFixture<AdvShipmentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvShipmentDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvShipmentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
