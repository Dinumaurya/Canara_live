import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuarbeneficiaryComponent } from './guarbeneficiary.component';

describe('GuarbeneficiaryComponent', () => {
  let component: GuarbeneficiaryComponent;
  let fixture: ComponentFixture<GuarbeneficiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuarbeneficiaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuarbeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
