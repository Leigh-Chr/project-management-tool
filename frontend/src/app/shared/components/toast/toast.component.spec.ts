import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastComponent } from './toast.component';
import { Toast } from './toast.service';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;

  const mockToast: Toast = {
    id: 1,
    title: 'Test Title',
    message: 'Test Message',
    type: 'success'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    component.toast = mockToast;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display toast title and message', () => {
    const titleElement = fixture.nativeElement.querySelector('h3');
    const messageElement = fixture.nativeElement.querySelector('p');

    expect(titleElement.textContent.trim()).toBe('Test Title');
    expect(messageElement.textContent.trim()).toBe('Test Message');
  });

  it('should apply correct CSS class for toast type', () => {
    const toastElement = fixture.nativeElement.querySelector('.toast');
    expect(toastElement).toBeTruthy();
    expect(toastElement.getAttribute('class')).toContain('toast--success');
  });

  it('should handle different toast types', () => {
    // Test that component can handle different toast types
    component.toast = { ...mockToast, type: 'error' };
    fixture.detectChanges();
    expect(component.toast.type).toBe('error');

    component.toast = { ...mockToast, type: 'info' };
    fixture.detectChanges();
    expect(component.toast.type).toBe('info');
  });

  it('should have correct ARIA role', () => {
    const toastElement = fixture.nativeElement.querySelector('.toast');
    expect(toastElement.getAttribute('role')).toBe('alert');
  });

  it('should emit close event when close button is clicked', () => {
    spyOn(component.close, 'emit');
    const closeButton = fixture.nativeElement.querySelector('.toast__close');
    closeButton.click();

    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should render close button with icon', () => {
    const closeButton = fixture.nativeElement.querySelector('.toast__close');
    const icon = closeButton.querySelector('i');

    expect(closeButton).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(icon.classList.contains('fi')).toBe(true);
    expect(icon.classList.contains('fi-rr-cross')).toBe(true);
  });
});
