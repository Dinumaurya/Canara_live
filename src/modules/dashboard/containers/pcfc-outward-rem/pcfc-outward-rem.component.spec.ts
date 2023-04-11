import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcfcOutwardRemComponent } from './pcfc-outward-rem.component';

describe('PcfcOutwardRemComponent', () => {
  let component: PcfcOutwardRemComponent;
  let fixture: ComponentFixture<PcfcOutwardRemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PcfcOutwardRemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PcfcOutwardRemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
