import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { StatusService } from './status.service';
import { ApiService } from '../api.service';

describe('StatusService', () => {
  let service: StatusService;
  let apiService: jasmine.SpyObj<ApiService>;

  const mockStatuses = [
    { id: 1, name: 'Active' },
    { id: 2, name: 'Completed' },
    { id: 3, name: 'In Progress' }
  ];

  beforeEach(() => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['get']);

    TestBed.configureTestingModule({
      providers: [
        StatusService,
        { provide: ApiService, useValue: apiSpy }
      ]
    });

    service = TestBed.inject(StatusService);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getStatuses', () => {
    it('should return statuses from API', () => {
      apiService.get.and.returnValue(of(mockStatuses));

      service.getStatuses().subscribe(statuses => {
        expect(statuses).toEqual(mockStatuses);
      });

      expect(apiService.get).toHaveBeenCalledWith('/statuses');
    });

    it('should handle API errors', () => {
      const error = new Error('API Error');
      apiService.get.and.returnValue(throwError(() => error));

      service.getStatuses().subscribe({
        next: () => fail('should have failed'),
        error: (err) => {
          expect(err).toBe(error);
        }
      });
    });
  });
});
