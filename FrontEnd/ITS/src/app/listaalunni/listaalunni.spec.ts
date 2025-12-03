import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Listaalunni } from './listaalunni';

describe('Listaalunni', () => {
  let component: Listaalunni;
  let fixture: ComponentFixture<Listaalunni>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Listaalunni]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Listaalunni);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
