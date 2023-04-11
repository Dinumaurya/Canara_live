import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportPolicyComponent } from './export-policy.component';

describe('ExportPolicyComponent', () => {
  let component: ExportPolicyComponent;
  let fixture: ComponentFixture<ExportPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportPolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
