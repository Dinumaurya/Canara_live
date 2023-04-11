import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillOfficeComponent } from './bill-office.component';

describe('BillOfficeComponent', () => {
  let component: BillOfficeComponent;
  let fixture: ComponentFixture<BillOfficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillOfficeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
