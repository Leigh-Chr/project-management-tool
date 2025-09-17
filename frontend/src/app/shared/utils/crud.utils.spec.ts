import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CrudUtils } from './crud.utils';
import { ToastService } from '../components/toast/toast.service';

describe('CrudUtils', () => {
  let toastService: jasmine.SpyObj<ToastService>;
  let injector: any;

  beforeEach(() => {
    const toastSpy = jasmine.createSpyObj('ToastService', ['showToast']);
    TestBed.configureTestingModule({
      providers: [
        { provide: ToastService, useValue: toastSpy }
      ]
    });
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    injector = TestBed;
  });

  describe('createCrudOperation', () => {
    it('should return success response on successful operation', () => {
      const mockResponse = { id: 1, name: 'Test' };
      const operation = of(mockResponse);
      const onSuccess = jasmine.createSpy('onSuccess');
      const onError = jasmine.createSpy('onError');

      CrudUtils.createCrudOperation(operation, injector, onSuccess, onError).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      // Note: onSuccess is called asynchronously in an effect, so we can't test it synchronously
      expect(onError).not.toHaveBeenCalled();
    });

    it('should handle errors and return undefined', () => {
      const error = new Error('Test error');
      const operation = throwError(() => error);
      const onSuccess = jasmine.createSpy('onSuccess');
      const onError = jasmine.createSpy('onError');

      CrudUtils.createCrudOperation(operation, injector, onSuccess, onError).subscribe(response => {
        expect(response).toBeUndefined();
      });

      expect(onSuccess).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalledWith(error);
    });
  });

  describe('createDeleteOperation', () => {
    it('should return success response on successful deletion', () => {
      const mockResponse = { id: 1, message: 'Deleted successfully' };
      const operation = of(mockResponse);
      const onSuccess = jasmine.createSpy('onSuccess');

      CrudUtils.createDeleteOperation(operation, injector, onSuccess, toastService).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      // Note: onSuccess is called asynchronously in an effect, so we can't test it synchronously
    });

    it('should handle deletion errors', () => {
      const error = new Error('Delete failed');
      const operation = throwError(() => error);
      const onSuccess = jasmine.createSpy('onSuccess');

      CrudUtils.createDeleteOperation(operation, injector, onSuccess, toastService).subscribe(response => {
        expect(response).toBeUndefined();
      });

      expect(onSuccess).not.toHaveBeenCalled();
      expect(toastService.showToast).toHaveBeenCalledWith({
        title: 'Error',
        message: 'Delete operation failed',
        type: 'error'
      });
    });
  });

  describe('createPostOperation', () => {
    it('should return success response on successful creation', () => {
      const mockResponse = { id: 1, name: 'New Item' };
      const operation = of(mockResponse);
      const onSuccess = jasmine.createSpy('onSuccess');

      CrudUtils.createPostOperation(operation, injector, onSuccess, toastService).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      // Note: onSuccess is called asynchronously in an effect, so we can't test it synchronously
    });

    it('should handle creation errors', () => {
      const error = new Error('Creation failed');
      const operation = throwError(() => error);
      const onSuccess = jasmine.createSpy('onSuccess');

      CrudUtils.createPostOperation(operation, injector, onSuccess, toastService).subscribe(response => {
        expect(response).toBeUndefined();
      });

      expect(onSuccess).not.toHaveBeenCalled();
      expect(toastService.showToast).toHaveBeenCalledWith({
        title: 'Error',
        message: 'Create operation failed',
        type: 'error'
      });
    });
  });

  describe('createPatchOperation', () => {
    it('should return success response on successful update', () => {
      const mockResponse = { id: 1, name: 'Updated Item' };
      const operation = of(mockResponse);
      const onSuccess = jasmine.createSpy('onSuccess');

      CrudUtils.createPatchOperation(operation, injector, onSuccess, toastService).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      // Note: onSuccess is called asynchronously in an effect, so we can't test it synchronously
    });

    it('should handle update errors', () => {
      const error = new Error('Update failed');
      const operation = throwError(() => error);
      const onSuccess = jasmine.createSpy('onSuccess');

      CrudUtils.createPatchOperation(operation, injector, onSuccess, toastService).subscribe(response => {
        expect(response).toBeUndefined();
      });

      expect(onSuccess).not.toHaveBeenCalled();
      expect(toastService.showToast).toHaveBeenCalledWith({
        title: 'Error',
        message: 'Update operation failed',
        type: 'error'
      });
    });
  });
});
