import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuarChargeComponent } from './guar-charge.component';

describe('GuarChargeComponent', () => {
  let component: GuarChargeComponent;
  let fixture: ComponentFixture<GuarChargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuarChargeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuarChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
