import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvOfficeUseComponent } from './adv-office-use.component';

describe('AdvOfficeUseComponent', () => {
  let component: AdvOfficeUseComponent;
  let fixture: ComponentFixture<AdvOfficeUseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvOfficeUseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvOfficeUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
