import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantdetailComponent } from './applicantdetail.component';

describe('ApplicantdetailComponent', () => {
  let component: ApplicantdetailComponent;
  let fixture: ComponentFixture<ApplicantdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicantdetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
