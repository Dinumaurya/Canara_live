import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmendLcOfficeComponent } from './amend-lc-office.component';

describe('AmendLcOfficeComponent', () => {
  let component: AmendLcOfficeComponent;
  let fixture: ComponentFixture<AmendLcOfficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmendLcOfficeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmendLcOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
