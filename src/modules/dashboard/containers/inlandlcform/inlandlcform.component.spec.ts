import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InlandlcformComponent } from './inlandlcform.component';

describe('InlandlcformComponent', () => {
  let component: InlandlcformComponent;
  let fixture: ComponentFixture<InlandlcformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InlandlcformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InlandlcformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
