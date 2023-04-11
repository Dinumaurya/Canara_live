import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmendmentLcFormComponent } from './amendment-lc-form.component';

describe('AmendmentLcFormComponent', () => {
  let component: AmendmentLcFormComponent;
  let fixture: ComponentFixture<AmendmentLcFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmendmentLcFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmendmentLcFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
