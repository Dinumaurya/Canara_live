import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillPolicyComponent } from './bill-policy.component';

describe('BillPolicyComponent', () => {
  let component: BillPolicyComponent;
  let fixture: ComponentFixture<BillPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillPolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
