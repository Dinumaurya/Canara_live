import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportOfficeComponent } from './export-office.component';

describe('ExportOfficeComponent', () => {
  let component: ExportOfficeComponent;
  let fixture: ComponentFixture<ExportOfficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportOfficeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
