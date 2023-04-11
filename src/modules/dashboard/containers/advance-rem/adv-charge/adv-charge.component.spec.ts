import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvChargeComponent } from './adv-charge.component';

describe('AdvChargeComponent', () => {
  let component: AdvChargeComponent;
  let fixture: ComponentFixture<AdvChargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvChargeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
