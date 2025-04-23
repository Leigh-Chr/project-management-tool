import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { SelectFieldComponent } from './select-field.component';

describe('SelectFieldComponent', () => {
  let component: SelectFieldComponent<string>;
  let fixture: ComponentFixture<SelectFieldComponent<string>>;
  let control: FormControl;

  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectFieldComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectFieldComponent<string>);
    component = fixture.componentInstance;
    control = new FormControl('', [Validators.required]);
    fixture.componentRef.setInput('control', control);
    fixture.componentRef.setInput('label', 'Test Label');
    fixture.componentRef.setInput('options', mockOptions);
    fixture.componentRef.setInput('errorMessage', 'This field is required');
    fixture.detectChanges();
  });

  it('should create and render select with options', () => {
    expect(component).toBeTruthy();
    const selectElement = fixture.nativeElement.querySelector('select');
    const labelElement = fixture.nativeElement.querySelector('label');
    const options = fixture.nativeElement.querySelectorAll('option');
    
    expect(selectElement).toBeTruthy();
    expect(labelElement).toBeTruthy();
    expect(options.length).toBe(2);
    expect(options[0].textContent).toContain('Option 1');
    expect(options[1].textContent).toContain('Option 2');
  });

  it('should show required asterisk when required is true', () => {
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();
    const requiredElement = fixture.nativeElement.querySelector('.select-field__required');
    expect(requiredElement).toBeTruthy();
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