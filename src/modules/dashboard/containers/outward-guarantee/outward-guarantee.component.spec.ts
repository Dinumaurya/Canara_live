import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutwardGuaranteeComponent } from './outward-guarantee.component';

describe('OutwardGuaranteeComponent', () => {
  let component: OutwardGuaranteeComponent;
  let fixture: ComponentFixture<OutwardGuaranteeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutwardGuaranteeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutwardGuaranteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
