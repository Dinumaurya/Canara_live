import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportBillCollectionComponent } from './import-bill-collection.component';

describe('ImportBillCollectionComponent', () => {
  let component: ImportBillCollectionComponent;
  let fixture: ComponentFixture<ImportBillCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportBillCollectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportBillCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
