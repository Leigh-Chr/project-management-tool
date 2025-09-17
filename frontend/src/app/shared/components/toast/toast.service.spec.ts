import { TestBed } from '@angular/core/testing';
import { ToastService, ToastInput } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('showToast', () => {
    it('should add a new toast to the list', () => {
      const toastInput: ToastInput = {
        title: 'Success',
        message: 'Operation completed successfully',
        type: 'success'
      };

      service.showToast(toastInput);

      service.getToasts().subscribe(toasts => {
        expect(toasts.length).toBe(1);
        expect(toasts[0].title).toBe('Success');
        expect(toasts[0].message).toBe('Operation completed successfully');
        expect(toasts[0].type).toBe('success');
      });
    });

    it('should use default type "info" when type is not provided', () => {
      const toastInput: ToastInput = {
        title: 'Info',
        message: 'This is an info message'
      };

      service.showToast(toastInput);

      service.getToasts().subscribe(toasts => {
        expect(toasts[0].type).toBe('info');
      });
    });

    it('should assign unique IDs to toasts', () => {
      const toastInput1: ToastInput = {
        title: 'First Toast',
        message: 'First message'
      };
      const toastInput2: ToastInput = {
        title: 'Second Toast',
        message: 'Second message'
      };

      service.showToast(toastInput1);
      service.showToast(toastInput2);

      service.getToasts().subscribe(toasts => {
        expect(toasts.length).toBe(2);
        expect(toasts[0].id).not.toBe(toasts[1].id);
      });
    });

    it('should limit to maximum 5 toasts', () => {
      // Add 6 toasts
      for (let i = 0; i < 6; i++) {
        service.showToast({
          title: `Toast ${i}`,
          message: `Message ${i}`
        });
      }

      service.getToasts().subscribe(toasts => {
        expect(toasts.length).toBe(5);
        // The first toast should be removed
        expect(toasts[0].title).toBe('Toast 1');
        expect(toasts[4].title).toBe('Toast 5');
      });
    });
  });

  describe('clearToast', () => {
    it('should remove a specific toast by ID', () => {
      const toastInput: ToastInput = {
        title: 'Test Toast',
        message: 'Test message'
      };

      service.showToast(toastInput);
      
      let toasts: any[] = [];
      service.getToasts().subscribe(ts => toasts = ts);
      
      expect(toasts.length).toBe(1);
      const toastId = toasts[0].id;
      
      service.clearToast(toastId);
      
      service.getToasts().subscribe(updatedToasts => {
        expect(updatedToasts.length).toBe(0);
      });
    });

    it('should not remove other toasts when clearing a specific one', () => {
      const toastInput1: ToastInput = {
        title: 'First Toast',
        message: 'First message'
      };
      const toastInput2: ToastInput = {
        title: 'Second Toast',
        message: 'Second message'
      };

      service.showToast(toastInput1);
      service.showToast(toastInput2);
      
      let toasts: any[] = [];
      service.getToasts().subscribe(ts => toasts = ts);
      
      expect(toasts.length).toBe(2);
      const firstToastId = toasts[0].id;
      
      service.clearToast(firstToastId);
      
      service.getToasts().subscribe(updatedToasts => {
        expect(updatedToasts.length).toBe(1);
        expect(updatedToasts[0].title).toBe('Second Toast');
      });
    });
  });

  describe('getToasts', () => {
    it('should return observable of toasts', () => {
      const toastInput: ToastInput = {
        title: 'Test Toast',
        message: 'Test message'
      };

      service.showToast(toastInput);

      service.getToasts().subscribe(toasts => {
        expect(Array.isArray(toasts)).toBe(true);
        expect(toasts.length).toBe(1);
      });
    });
  });

  describe('toast types', () => {
    it('should handle success type', () => {
      const toastInput: ToastInput = {
        title: 'Success',
        message: 'Operation successful',
        type: 'success'
      };

      service.showToast(toastInput);

      service.getToasts().subscribe(toasts => {
        expect(toasts[0].type).toBe('success');
      });
    });

    it('should handle error type', () => {
      const toastInput: ToastInput = {
        title: 'Error',
        message: 'Operation failed',
        type: 'error'
      };

      service.showToast(toastInput);

      service.getToasts().subscribe(toasts => {
        expect(toasts[0].type).toBe('error');
      });
    });

    it('should handle info type', () => {
      const toastInput: ToastInput = {
        title: 'Info',
        message: 'Information message',
        type: 'info'
      };

      service.showToast(toastInput);

      service.getToasts().subscribe(toasts => {
        expect(toasts[0].type).toBe('info');
      });
    });
  });
});
