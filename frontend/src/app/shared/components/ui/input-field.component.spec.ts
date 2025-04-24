import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputFieldComponent } from './input-field.component';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';

describe('InputFieldComponent', () => {
  let component: InputFieldComponent;
  let fixture: ComponentFixture<InputFieldComponent>;
  let control: FormControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputFieldComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(InputFieldComponent);
    component = fixture.componentInstance;
    control = new FormControl('', [Validators.required]);
    fixture.componentRef.setInput('control', control);
    fixture.componentRef.setInput('label', 'Test Label');
    fixture.componentRef.setInput('type', 'text');
    fixture.componentRef.setInput('errorMessage', 'This field is required');
    fixture.detectChanges();
  });

  it('should create and render input with label', () => {
    expect(component).toBeTruthy();
    const inputElement = fixture.nativeElement.querySelector('input');
    const labelElement = fixture.nativeElement.querySelector('label');
    expect(inputElement).toBeTruthy();
    expect(labelElement).toBeTruthy();
    expect(labelElement.textContent).toContain('Test Label');
  });

  it('should show required asterisk when required is true', () => {
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();
    const labelElement = fixture.nativeElement.querySelector('label');
    expect(labelElement.textContent).toContain('*');
  });

  it('should show error message when control is invalid and touched', () => {
    control.setErrors({ required: true });
    control.markAsTouched();
    fixture.detectChanges();
    const errorElement = fixture.nativeElement.querySelector('.error');
    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent).toContain('This field is required');
  });
}); 