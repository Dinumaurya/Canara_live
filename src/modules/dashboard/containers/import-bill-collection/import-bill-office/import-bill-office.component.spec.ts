import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportBillOfficeComponent } from './import-bill-office.component';

describe('ImportBillOfficeComponent', () => {
  let component: ImportBillOfficeComponent;
  let fixture: ComponentFixture<ImportBillOfficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportBillOfficeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportBillOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
