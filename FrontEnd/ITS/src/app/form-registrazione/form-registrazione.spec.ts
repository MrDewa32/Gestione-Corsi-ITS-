import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormRegistrazioneComponent } from './form-registrazione';


describe('FormRegistrazioneComponent', () => {
let component: FormRegistrazioneComponent;
let fixture: ComponentFixture<FormRegistrazioneComponent>;


beforeEach(async () => {
await TestBed.configureTestingModule({
declarations: [FormRegistrazioneComponent],
imports: [ReactiveFormsModule]
}).compileComponents();


fixture = TestBed.createComponent(FormRegistrazioneComponent);
component = fixture.componentInstance;
fixture.detectChanges();
});


it('should create', () => {
expect(component).toBeTruthy();
});
});