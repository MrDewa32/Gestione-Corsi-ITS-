import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Offerta } from './offerta';

describe('Offerta', () => {
  let component: Offerta;
  let fixture: ComponentFixture<Offerta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Offerta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Offerta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
