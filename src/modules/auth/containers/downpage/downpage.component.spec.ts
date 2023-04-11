import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownpageComponent } from './downpage.component';

describe('DownpageComponent', () => {
  let component: DownpageComponent;
  let fixture: ComponentFixture<DownpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownpageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
