import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvOutwardRemComponent } from './adv-outward-rem.component';

describe('AdvOutwardRemComponent', () => {
  let component: AdvOutwardRemComponent;
  let fixture: ComponentFixture<AdvOutwardRemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvOutwardRemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvOutwardRemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
