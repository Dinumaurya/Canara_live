import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpfcFirstComponent } from './cpfc-first.component';

describe('CpfcFirstComponent', () => {
  let component: CpfcFirstComponent;
  let fixture: ComponentFixture<CpfcFirstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpfcFirstComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpfcFirstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
