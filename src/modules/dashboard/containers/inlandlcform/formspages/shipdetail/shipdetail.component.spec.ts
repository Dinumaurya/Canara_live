import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipdetailComponent } from './shipdetail.component';

describe('ShipdetailComponent', () => {
  let component: ShipdetailComponent;
  let fixture: ComponentFixture<ShipdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipdetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
