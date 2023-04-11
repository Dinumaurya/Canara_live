import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportBillPolicyComponent } from './import-bill-policy.component';

describe('ImportBillPolicyComponent', () => {
  let component: ImportBillPolicyComponent;
  let fixture: ComponentFixture<ImportBillPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportBillPolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportBillPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
