import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwardCntctListComponent } from './forward-cntct-list.component';

describe('ForwardCntctListComponent', () => {
  let component: ForwardCntctListComponent;
  let fixture: ComponentFixture<ForwardCntctListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForwardCntctListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForwardCntctListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
