import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcOfficeComponent } from './lc-office.component';

describe('LcOfficeComponent', () => {
  let component: LcOfficeComponent;
  let fixture: ComponentFixture<LcOfficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LcOfficeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LcOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
