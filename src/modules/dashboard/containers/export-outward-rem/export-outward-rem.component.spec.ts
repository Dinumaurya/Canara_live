import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportOutwardRemComponent } from './export-outward-rem.component';

describe('ExportOutwardRemComponent', () => {
  let component: ExportOutwardRemComponent;
  let fixture: ComponentFixture<ExportOutwardRemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportOutwardRemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportOutwardRemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
