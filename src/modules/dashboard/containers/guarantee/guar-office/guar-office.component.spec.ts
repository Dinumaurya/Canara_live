import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuarOfficeComponent } from './guar-office.component';

describe('GuarOfficeComponent', () => {
  let component: GuarOfficeComponent;
  let fixture: ComponentFixture<GuarOfficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuarOfficeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuarOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
