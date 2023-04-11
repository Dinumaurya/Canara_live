import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillChargeComponent } from './bill-charge.component';

describe('BillChargeComponent', () => {
  let component: BillChargeComponent;
  let fixture: ComponentFixture<BillChargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillChargeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
