import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Creacorso } from './creacorso';

describe('Creacorso', () => {
  let component: Creacorso;
  let fixture: ComponentFixture<Creacorso>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Creacorso]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Creacorso);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
