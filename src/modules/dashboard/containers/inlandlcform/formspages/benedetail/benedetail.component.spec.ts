import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenedetailComponent } from './benedetail.component';

describe('BenedetailComponent', () => {
  let component: BenedetailComponent;
  let fixture: ComponentFixture<BenedetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BenedetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BenedetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
