import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficedetailComponent } from './officedetail.component';

describe('OfficedetailComponent', () => {
  let component: OfficedetailComponent;
  let fixture: ComponentFixture<OfficedetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfficedetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficedetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
