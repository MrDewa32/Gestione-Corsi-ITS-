import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioModulo } from './dettagliomodulo';

describe('DettaglioModulo', () => {
  let component: DettaglioModulo;
  let fixture: ComponentFixture<DettaglioModulo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DettaglioModulo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DettaglioModulo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
