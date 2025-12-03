import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Aggiungistudente } from './aggiungistudente';

describe('Aggiungistudente', () => {
  let component: Aggiungistudente;
  let fixture: ComponentFixture<Aggiungistudente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Aggiungistudente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Aggiungistudente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
