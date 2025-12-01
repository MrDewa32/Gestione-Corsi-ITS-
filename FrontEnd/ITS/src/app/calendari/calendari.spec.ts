import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Calendari } from './calendari';

describe('Calendari', () => {
  let component: Calendari;
  let fixture: ComponentFixture<Calendari>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Calendari]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Calendari);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
