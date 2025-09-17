import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastProviderComponent } from './toast-provider.component';
import { ToastService } from './toast.service';
import { signal } from '@angular/core';
import { of } from 'rxjs';

describe('ToastProviderComponent', () => {
  let component: ToastProviderComponent;
  let fixture: ComponentFixture<ToastProviderComponent>;
  let toastService: jasmine.SpyObj<ToastService>;

  const mockToasts = [
    {
      id: 1,
      title: 'Success',
      message: 'Operation completed',
      type: 'success' as const
    },
    {
      id: 2,
      title: 'Error',
      message: 'Operation failed',
      type: 'error' as const
    }
  ];

  beforeEach(async () => {
    const toastSpy = jasmine.createSpyObj('ToastService', ['clearToast']);
    toastSpy.getToasts = jasmine.createSpy('getToasts').and.returnValue(of(mockToasts));

    await TestBed.configureTestingModule({
      imports: [ToastProviderComponent],
      providers: [
        { provide: ToastService, useValue: toastSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ToastProviderComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display toasts from service', () => {
    fixture.detectChanges();
    
    const toastElements = fixture.nativeElement.querySelectorAll('ui-toast');
    expect(toastElements.length).toBe(2);
  });

  it('should call clearToast when toast close is triggered', () => {
    fixture.detectChanges();
    
    const toastElements = fixture.nativeElement.querySelectorAll('ui-toast');
    const firstToast = toastElements[0];
    
    // Simulate close event
    firstToast.dispatchEvent(new Event('close'));
    
    expect(toastService.clearToast).toHaveBeenCalledWith(1);
  });

  it('should render toast provider', () => {
    fixture.detectChanges();
    
    const providerElement = fixture.nativeElement.querySelector('.toast-provider');
    expect(providerElement).toBeTruthy();
  });
});
