import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargedetailComponent } from './chargedetail.component';

describe('ChargedetailComponent', () => {
  let component: ChargedetailComponent;
  let fixture: ComponentFixture<ChargedetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargedetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargedetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
