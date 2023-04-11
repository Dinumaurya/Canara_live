import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportShipmentComponent } from './export-shipment.component';

describe('ExportShipmentComponent', () => {
  let component: ExportShipmentComponent;
  let fixture: ComponentFixture<ExportShipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportShipmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
