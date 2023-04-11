import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillCollectionOutwardRemComponent } from './bill-collection-outward-rem.component';

describe('BillCollectionOutwardRemComponent', () => {
  let component: BillCollectionOutwardRemComponent;
  let fixture: ComponentFixture<BillCollectionOutwardRemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillCollectionOutwardRemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillCollectionOutwardRemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
