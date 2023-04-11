import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwardCntctComponent } from './forward-cntct.component';

describe('ForwardCntctComponent', () => {
  let component: ForwardCntctComponent;
  let fixture: ComponentFixture<ForwardCntctComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForwardCntctComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForwardCntctComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
