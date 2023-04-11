import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvPolicyComponent } from './adv-policy.component';

describe('AdvPolicyComponent', () => {
  let component: AdvPolicyComponent;
  let fixture: ComponentFixture<AdvPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvPolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
