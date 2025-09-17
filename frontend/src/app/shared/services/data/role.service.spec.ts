import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { RoleService } from './role.service';
import { ApiService } from '../api.service';

describe('RoleService', () => {
  let service: RoleService;
  let apiService: jasmine.SpyObj<ApiService>;

  const mockRoles = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Member' },
    { id: 3, name: 'Observer' }
  ];

  beforeEach(() => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['get']);

    TestBed.configureTestingModule({
      providers: [
        RoleService,
        { provide: ApiService, useValue: apiSpy }
      ]
    });

    service = TestBed.inject(RoleService);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getRoles', () => {
    it('should return roles from API', () => {
      apiService.get.and.returnValue(of(mockRoles));

      service.getRoles().subscribe(roles => {
        expect(roles).toEqual(mockRoles);
      });

      expect(apiService.get).toHaveBeenCalledWith('/roles');
    });

    it('should handle API errors', () => {
      const error = new Error('API Error');
      apiService.get.and.returnValue(throwError(() => error));

      service.getRoles().subscribe({
        next: () => fail('should have failed'),
        error: (err) => {
          expect(err).toBe(error);
        }
      });
    });
  });
});
