import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportChargComponent } from './export-charg.component';

describe('ExportChargComponent', () => {
  let component: ExportChargComponent;
  let fixture: ComponentFixture<ExportChargComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportChargComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportChargComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
