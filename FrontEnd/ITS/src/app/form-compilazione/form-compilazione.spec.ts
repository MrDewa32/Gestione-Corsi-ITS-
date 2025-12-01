import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCompilazione } from './form-compilazione';

describe('FormCompilazione', () => {
  let component: FormCompilazione;
  let fixture: ComponentFixture<FormCompilazione>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCompilazione]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCompilazione);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
