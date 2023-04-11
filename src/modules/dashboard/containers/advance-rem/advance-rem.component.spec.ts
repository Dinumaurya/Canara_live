import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceRemComponent } from './advance-rem.component';

describe('AdvanceRemComponent', () => {
  let component: AdvanceRemComponent;
  let fixture: ComponentFixture<AdvanceRemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvanceRemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceRemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
