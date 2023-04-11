import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportBillCollectionOutwardComponent } from './import-bill-collection-outward.component';

describe('ImportBillCollectionOutwardComponent', () => {
  let component: ImportBillCollectionOutwardComponent;
  let fixture: ComponentFixture<ImportBillCollectionOutwardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportBillCollectionOutwardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportBillCollectionOutwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
