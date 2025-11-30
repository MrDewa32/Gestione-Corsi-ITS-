import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cardoutline } from './cardoutline';

describe('Cardoutline', () => {
  let component: Cardoutline;
  let fixture: ComponentFixture<Cardoutline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cardoutline]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cardoutline);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
