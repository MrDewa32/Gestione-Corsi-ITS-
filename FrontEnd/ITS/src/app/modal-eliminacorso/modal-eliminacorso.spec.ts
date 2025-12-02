/// <reference types="vitest/globals" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { vi } from 'vitest';
import { ModalDeleteCourseComponent } from './modal-eliminacorso';

describe('ModalDeleteCourseComponent', () => {
  let component: ModalDeleteCourseComponent;
  let fixture: ComponentFixture<ModalDeleteCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ModalDeleteCourseComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalDeleteCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create modal', () => {
    expect(component).toBeTruthy();
  });

  it('should emit deleteConfirmed when password is entered', () => {
    component.password = 'mypassword';
    vi.spyOn(component.deleteConfirmed, 'emit');

    component.confirmDelete();

    expect(component.deleteConfirmed.emit).toHaveBeenCalledWith('mypassword');
  });

  it('should emit closed on close()', () => {
    vi.spyOn(component.closed, 'emit');
    component.close();
    expect(component.closed.emit).toHaveBeenCalled();
  });
});
