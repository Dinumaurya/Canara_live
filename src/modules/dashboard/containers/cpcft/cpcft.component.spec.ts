import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpcftComponent } from './cpcft.component';

describe('CpcftComponent', () => {
  let component: CpcftComponent;
  let fixture: ComponentFixture<CpcftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpcftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpcftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
