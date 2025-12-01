import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Elencostudenti } from './elencostudenti';

describe('Elencostudenti', () => {
  let component: Elencostudenti;
  let fixture: ComponentFixture<Elencostudenti>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Elencostudenti]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Elencostudenti);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
