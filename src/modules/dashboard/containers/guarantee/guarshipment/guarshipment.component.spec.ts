import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuarshipmentComponent } from './guarshipment.component';

describe('GuarshipmentComponent', () => {
  let component: GuarshipmentComponent;
  let fixture: ComponentFixture<GuarshipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuarshipmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuarshipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
