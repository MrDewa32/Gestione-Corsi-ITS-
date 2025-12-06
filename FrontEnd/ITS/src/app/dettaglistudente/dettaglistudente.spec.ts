import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dettaglistudente } from './dettaglistudente';

describe('Dettaglistudente', () => {
  let component: Dettaglistudente;
  let fixture: ComponentFixture<Dettaglistudente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dettaglistudente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dettaglistudente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
